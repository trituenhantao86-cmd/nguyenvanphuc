import React, { useState, useId } from "react";
import mammoth from "mammoth";
import { DocumentData, AuditResult } from "../types";
import { auditAdministrativeDocument, autoFixDocument } from "../utils/ruleChecker";
import { generateDocxBlob, generateFileName, downloadDocx } from "../utils/docxGenerator";
import {
  UploadCloud,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wand2,
  Download,
  ArrowRight,
  FileText,
  ShieldCheck,
  Loader2,
} from "lucide-react";

interface DocxUploadCheckerProps {
  onOpenDocumentInEditor: (doc: DocumentData) => void;
  onCancel: () => void;
}

export const DocxUploadChecker: React.FC<DocxUploadCheckerProps> = ({
  onOpenDocumentInEditor,
  onCancel,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [parsedDoc, setParsedDoc] = useState<DocumentData | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const docFileInputId = useId();

  // Process raw text into structured DocumentData
  const convertTextToDocumentData = (rawText: string, name: string): DocumentData => {
    const lines = rawText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    // Heuristics extraction
    let docType = "Kế hoạch";
    let title = "VĂN BẢN HÀNH CHÍNH";
    let subject = "Về việc triển khai công tác...";
    let orgName = "TRƯỜNG THCS NGUYỄN DU";
    let parentOrg = "SỞ GIÁO DỤC VÀ ĐÀO TẠO";
    let code = "Số: .../KH-...";
    let date = `ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`;
    let signerName = "Trần Văn An";
    let signerTitle = "HIỆU TRƯỞNG";
    const bases: string[] = [];
    const sections: { heading: string; items: string[] }[] = [];
    let currentSec = { heading: "I. NỘI DUNG VĂN BẢN", items: [] as string[] };

    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.startsWith("kế hoạch") || lower === "kế hoạch") {
        docType = "Kế hoạch";
        title = "KẾ HOẠCH";
      } else if (lower.startsWith("quyết định") || lower === "quyết định") {
        docType = "Quyết định";
        title = "QUYẾT ĐỊNH";
      } else if (lower.startsWith("báo cáo") || lower === "báo cáo") {
        docType = "Báo cáo";
        title = "BÁO CÁO";
      } else if (lower.startsWith("thông báo") || lower === "thông báo") {
        docType = "Thông báo";
        title = "THÔNG BÁO";
      } else if (lower.startsWith("tờ trình") || lower === "tờ trình") {
        docType = "Tờ trình";
        title = "TỜ TRÌNH";
      }

      if (lower.startsWith("căn cứ")) {
        bases.push(line);
        continue;
      }

      if (/^(i|ii|iii|iv|v|vi|vii|điều\s+\d+)\b/i.test(line)) {
        if (currentSec.items.length > 0) {
          sections.push(currentSec);
        }
        currentSec = { heading: line, items: [] };
        continue;
      }

      if (line.startsWith("Số:") || line.startsWith("Số ")) {
        code = line;
        continue;
      }

      if (lower.includes("ngày") && lower.includes("tháng") && lower.includes("năm")) {
        date = line;
        continue;
      }

      if (currentSec.items.length < 20) {
        currentSec.items.push(line);
      }
    }

    if (currentSec.items.length > 0) {
      sections.push(currentSec);
    }

    if (sections.length === 0) {
      sections.push({
        heading: "I. NỘI DUNG CHI TIẾT",
        items: lines.slice(0, 10),
      });
    }

    const docData: DocumentData = {
      id: `doc-uploaded-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      docType,
      category: "school",
      parentOrg,
      orgName,
      orgType: "Trường THCS",
      address: "Địa chỉ đơn vị",
      location: "Hà Nội",
      province: "Thành phố Hà Nội",
      adminUnit: "Phường",
      code,
      date,
      title,
      documentSubject: subject,
      legalBases: bases.length > 0 ? bases : ["Nghị định số 30/2020/NĐ-CP ngày 05/3/2020 của Chính phủ về công tác văn thư;"],
      contentSections: sections,
      recipients: ["Ban Giám hiệu;", "Các tổ chuyên môn;", "Lưu: VT, hồ sơ."],
      signerTitle,
      signerSignType: "Ký trực tiếp",
      signerName,
    };

    docData.auditResult = auditAdministrativeDocument(docData);
    return docData;
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.name.endsWith(".docx") && !file.name.endsWith(".doc")) {
      alert("Vui lòng tải lên file định dạng Word (.docx).");
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    setIsAuditing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value || "";
      setExtractedText(text);

      // Create structured document data
      const doc = convertTextToDocumentData(text, file.name);

      // Call AI audit endpoint if available
      try {
        const response = await fetch("/api/ai/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rawText: text,
            document: doc,
          }),
        });
        const auditResponse = await response.json();
        if (auditResponse.success && auditResponse.audit) {
          doc.auditResult = {
            ...doc.auditResult,
            ...auditResponse.audit,
          };
        }
      } catch (e) {
        console.warn("AI audit endpoint failed, falling back to local audit", e);
      }

      setParsedDoc(doc);
      setAuditResult(doc.auditResult);
    } catch (err: any) {
      console.error("Mammoth extract error:", err);
      alert("Không thể đọc tệp Word này. Vui lòng kiểm tra định dạng .docx.");
    } finally {
      setIsProcessing(false);
      setIsAuditing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleExportFixed = async () => {
    if (!parsedDoc) return;
    const fixed = autoFixDocument(parsedDoc);
    const blob = await generateDocxBlob(fixed);
    const fname = generateFileName(fixed);
    downloadDocx(blob, fname);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <FileCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Kiểm tra & Chuẩn hóa file Word (.docx)
            </h1>
            <p className="text-xs text-slate-500">
              Tải lên file văn bản để AI rà soát 3 tầng: Nội dung, Thẩm quyền/Địa giới hành chính và Thể thức Nghị định 30/2020/NĐ-CP.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Box */}
      {!parsedDoc && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all bg-white ${
            dragActive
              ? "border-sky-500 bg-sky-50/50 scale-102"
              : "border-slate-300 hover:border-sky-400"
          }`}
        >
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
              {isProcessing ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <UploadCloud className="w-8 h-8" />
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isProcessing ? "Đang đọc & phân tích văn bản..." : "Kéo thả file .docx vào đây"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                hoặc bấm nút bên dưới để chọn file Word từ máy tính của bạn
              </p>
            </div>

            <div className="pt-2">
              <label
                htmlFor={docFileInputId}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 cursor-pointer inline-flex items-center space-x-2 transition-all active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>Chọn file .docx</span>
              </label>
              <input
                id={docFileInputId}
                type="file"
                accept=".docx,.doc"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </div>

            <p className="text-[11px] text-slate-400">
              Hỗ trợ tệp Microsoft Word chuẩn (.docx). Không tải file chứa thông tin mật.
            </p>
          </div>
        </div>
      )}

      {/* Audit Result Display */}
      {parsedDoc && auditResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Header result */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wide">
                Kết quả kiểm tra tệp tin:
              </span>
              <h2 className="text-lg font-black text-slate-900">{fileName}</h2>
              <p className="text-xs text-slate-500">
                Thể loại: {parsedDoc.docType} • Cơ quan: {parsedDoc.orgName}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900 block">
                  {auditResult.totalScore}/100
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">Điểm thể thức</span>
              </div>
              <button
                onClick={() => {
                  setParsedDoc(null);
                  setFileName(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Tải file khác
              </button>
            </div>
          </div>

          {/* Outdated District Rule Alert */}
          {auditResult.hasOutdatedDistrict && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>CẢNH BÁO QUY TẮC ĐẶC BIỆT: “KHÔNG CÒN CẤP HUYỆN”</span>
              </div>
              <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                {auditResult.adminUnitMessage}
              </p>
              {auditResult.outdatedDistrictWarnings.map((w, idx) => (
                <p key={idx} className="text-xs text-amber-700">
                  • {w}
                </p>
              ))}
            </div>
          )}

          {/* 10 Checks list */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800">
              Chi tiết rà soát đối chiếu Nghị định 30/2020/NĐ-CP:
            </span>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {auditResult.checks.map((chk) => (
                <div
                  key={chk.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between text-xs gap-2"
                >
                  <div className="flex items-start space-x-2">
                    {chk.status === "pass" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : chk.status === "warn" ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold text-slate-900 block">{chk.name}</span>
                      <span className="text-slate-500 text-[11px] leading-relaxed">
                        {chk.detail}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] shrink-0 ${
                      chk.status === "pass"
                        ? "bg-emerald-100 text-emerald-800"
                        : chk.status === "warn"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {chk.status === "pass" ? "Đạt" : chk.status === "warn" ? "Cần lưu ý" : "Chưa chuẩn"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              onClick={() => onOpenDocumentInEditor(parsedDoc)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>Chuyển vào Trình soạn thảo A4 để sửa</span>
            </button>

            <button
              onClick={handleExportFixed}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải file Word (.docx) đã chuẩn hóa</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
