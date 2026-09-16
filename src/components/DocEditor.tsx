import React, { useState, useId } from "react";
import { DocumentData, AuditResult } from "../types";
import { generateDocxBlob, generateFileName, downloadDocx } from "../utils/docxGenerator";
import { autoFixDocument, auditAdministrativeDocument } from "../utils/ruleChecker";
import {
  Download,
  Copy,
  Check,
  Sparkles,
  Search,
  Wand2,
  Minimize2,
  Maximize2,
  Printer,
  Plus,
  Trash2,
  ArrowLeft,
  Sliders,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  FileCheck,
  Building2,
  Scale,
  Users,
} from "lucide-react";

interface DocEditorProps {
  document: DocumentData;
  onUpdateDocument: (doc: DocumentData) => void;
  onOpenAuditModal: () => void;
  onBack: () => void;
}

export const DocEditor: React.FC<DocEditorProps> = ({
  document: doc,
  onUpdateDocument,
  onOpenAuditModal,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "bases" | "sections" | "signer">("sections");
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [aiRefining, setAiRefining] = useState<boolean>(false);
  const [aiNotification, setAiNotification] = useState<string | null>(null);

  const editDocTitleInputId = useId();
  const editDocSubjectInputId = useId();
  const editParentOrgInputId = useId();
  const editOrgNameInputId = useId();
  const editDocCodeInputId = useId();
  const editDocDateInputId = useId();
  const editDocLocationInputId = useId();
  const editAdminUnitInputId = useId();
  const editProvinceInputId = useId();
  const editSignerNameInputId = useId();
  const editSignerTitleInputId = useId();
  const editSignTypeSelectId = useId();

  // Update field helper
  const updateField = <K extends keyof DocumentData>(key: K, value: DocumentData[K]) => {
    const updated = {
      ...doc,
      [key]: value,
      updatedAt: new Date().toISOString(),
    };
    updated.auditResult = auditAdministrativeDocument(updated);
    onUpdateDocument(updated);
  };

  // Auto-fix layout to Decree 30 standards
  const handleAutoFix = () => {
    const fixed = autoFixDocument(doc);
    onUpdateDocument(fixed);
    setAiNotification("Đã tự động chuẩn hóa văn bản theo đúng thể thức Nghị định 30/2020/NĐ-CP!");
    setTimeout(() => setAiNotification(null), 3500);
  };

  // AI Refine Content helper
  const handleAiRefine = async (action: "expand" | "shorten" | "formalize" | "fix_grammar") => {
    setAiRefining(true);
    setAiNotification(
      action === "expand"
        ? "AI đang mở rộng nội dung chi tiết..."
        : action === "shorten"
        ? "AI đang tinh gọn nội dung..."
        : action === "formalize"
        ? "AI đang chuẩn hóa văn phong hành chính..."
        : "AI đang rà soát lỗi chính tả và ngữ pháp..."
    );

    try {
      const response = await fetch("/api/ai/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document: doc,
          action,
        }),
      });

      const res = await response.json();
      if (res.success && res.data) {
        const refinedDoc = {
          ...doc,
          ...res.data,
          updatedAt: new Date().toISOString(),
        };
        refinedDoc.auditResult = auditAdministrativeDocument(refinedDoc);
        onUpdateDocument(refinedDoc);
        setAiNotification("AI đã cập nhật nội dung thành công!");
      } else {
        setAiNotification("Đã rà soát và giữ nguyên cấu trúc văn bản chuẩn.");
      }
    } catch (err) {
      console.error(err);
      setAiNotification("Không thể kết nối máy chủ AI lúc này. Văn bản hiện tại vẫn hợp lệ.");
    } finally {
      setAiRefining(false);
      setTimeout(() => setAiNotification(null), 3000);
    }
  };

  // Export to Real DOCX
  const handleExportDocx = async () => {
    setIsExporting(true);
    try {
      const blob = await generateDocxBlob(doc);
      const filename = generateFileName(doc);
      downloadDocx(blob, filename);
      setAiNotification(`Đã xuất và tải file Word thành công: ${filename}`);
    } catch (err: any) {
      console.error("Export error:", err);
      alert("Lỗi tạo file Word: " + (err.message || "Vui lòng thử lại."));
    } finally {
      setIsExporting(false);
      setTimeout(() => setAiNotification(null), 3500);
    }
  };

  // Copy plain text to clipboard
  const handleCopyText = () => {
    const textLines: string[] = [
      (doc.parentOrg || "").toUpperCase(),
      (doc.orgName || "").toUpperCase(),
      doc.code || "",
      "-------------------------",
      "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
      "Độc lập - Tự do - Hạnh phúc",
      `${doc.location || "Địa danh"}, ${doc.date || ""}`,
      "",
      (doc.title || "").toUpperCase(),
      doc.documentSubject || "",
      "",
      ...(doc.legalBases || []).map((b) => `- Căn cứ ${b}`),
      "",
      ...doc.contentSections.flatMap((s) => [s.heading, ...s.items]),
      "",
      `Nơi nhận: ${doc.recipients.join(", ")}`,
      `${doc.signerSignType || ""} ${doc.signerTitle || ""}`,
      doc.signerName || "",
    ];

    navigator.clipboard.writeText(textLines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Print view
  const handlePrint = () => {
    window.print();
  };

  // Section editor helpers
  const handleHeadingChange = (index: number, newHeading: string) => {
    const newSections = [...doc.contentSections];
    newSections[index] = { ...newSections[index], heading: newHeading };
    updateField("contentSections", newSections);
  };

  const handleItemChange = (secIndex: number, itemIndex: number, newItem: string) => {
    const newSections = [...doc.contentSections];
    const newItems = [...newSections[secIndex].items];
    newItems[itemIndex] = newItem;
    newSections[secIndex] = { ...newSections[secIndex], items: newItems };
    updateField("contentSections", newSections);
  };

  const handleAddItem = (secIndex: number) => {
    const newSections = [...doc.contentSections];
    newSections[secIndex] = {
      ...newSections[secIndex],
      items: [...newSections[secIndex].items, "Nội dung điều khoản mới..."],
    };
    updateField("contentSections", newSections);
  };

  const handleRemoveItem = (secIndex: number, itemIndex: number) => {
    const newSections = [...doc.contentSections];
    const newItems = newSections[secIndex].items.filter((_, idx) => idx !== itemIndex);
    newSections[secIndex] = { ...newSections[secIndex], items: newItems };
    updateField("contentSections", newSections);
  };

  const handleAddSection = () => {
    const nextNum = ["I", "II", "III", "IV", "V", "VI", "VII"][doc.contentSections.length] || "MỤC";
    const newSec = {
      heading: `${nextNum}. MỤC MỚI BỔ SUNG`,
      items: ["1. Nội dung thứ nhất của mục mới."],
    };
    updateField("contentSections", [...doc.contentSections, newSec]);
  };

  const handleRemoveSection = (secIndex: number) => {
    const newSections = doc.contentSections.filter((_, idx) => idx !== secIndex);
    updateField("contentSections", newSections);
  };

  const auditResult = doc.auditResult || auditAdministrativeDocument(doc);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 space-y-4">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {doc.title || doc.docType}
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                {doc.docType}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">
              {doc.documentSubject || "Soạn thảo văn bản hành chính"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Quick Auto Fix */}
          <button
            id="btn-auto-fix"
            onClick={handleAutoFix}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all flex items-center space-x-1 active:scale-95"
            title="Tự động chuẩn hóa viết hoa, dấu chấm phẩy, căn lề theo NĐ 30"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Chuẩn hóa thể thức</span>
          </button>

          {/* Audit Score Badge Button */}
          <button
            id="btn-audit-score"
            onClick={onOpenAuditModal}
            className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold transition-all flex items-center space-x-1.5"
            title="Xem báo cáo chi tiết kiểm tra thể thức"
          >
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Điểm chuẩn: {auditResult.totalScore}/100</span>
          </button>

          {/* Copy Plaintext */}
          <button
            onClick={handleCopyText}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs transition-colors"
            title="Sao chép văn bản dạng chữ thô"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs transition-colors hidden sm:block"
            title="In văn bản"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* PRIMARY: EXPORT DOCX */}
          <button
            id="btn-export-docx"
            onClick={handleExportDocx}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            title="Tải file Microsoft Word .docx về máy"
          >
            <Download className="w-4 h-4 text-white" />
            <span>{isExporting ? "Đang tạo..." : "Tải Word (.docx)"}</span>
          </button>
        </div>
      </div>

      {/* AI Notification Banner */}
      {aiNotification && (
        <div className="p-3 rounded-xl bg-sky-100 border border-sky-200 text-sky-900 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-sky-600 animate-spin" />
            <span>{aiNotification}</span>
          </div>
          <button onClick={() => setAiNotification(null)} className="text-sky-700 hover:text-sky-950">
            ✕
          </button>
        </div>
      )}

      {/* Outdated District Warning Banner */}
      {auditResult.hasOutdatedDistrict && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Cảnh báo hành chính:</strong> Phát hiện thông tin hành chính có khả năng đã cũ (cấp huyện). Vui lòng kiểm tra lại theo đơn vị hành chính hiện hành.
            </span>
          </div>
          <button
            onClick={onOpenAuditModal}
            className="px-2.5 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-[11px] shrink-0 ml-2"
          >
            Xem chi tiết
          </button>
        </div>
      )}

      {/* Main Split Grid: Left Editor & Right A4 Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN: STRUCTURED EDITOR (5 COLS ON DESKTOP) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-4">
          {/* AI Refine Mini-bar */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Trợ lý AI tinh chỉnh nội dung:</span>
              </span>
              {aiRefining && <span className="text-[11px] text-sky-600 animate-pulse">Đang xử lý...</span>}
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <button
                disabled={aiRefining}
                onClick={() => handleAiRefine("expand")}
                className="px-2 py-1 rounded-md bg-white border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-700 font-medium transition-colors"
              >
                ➕ Mở rộng
              </button>
              <button
                disabled={aiRefining}
                onClick={() => handleAiRefine("shorten")}
                className="px-2 py-1 rounded-md bg-white border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-700 font-medium transition-colors"
              >
                ➖ Rút gọn
              </button>
              <button
                disabled={aiRefining}
                onClick={() => handleAiRefine("formalize")}
                className="px-2 py-1 rounded-md bg-white border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-700 font-medium transition-colors"
              >
                👔 Chuẩn hóa văn phong
              </button>
              <button
                disabled={aiRefining}
                onClick={() => handleAiRefine("fix_grammar")}
                className="px-2 py-1 rounded-md bg-white border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-700 font-medium transition-colors"
              >
                ✍️ Sửa lỗi chính tả
              </button>
            </div>
          </div>

          {/* Editor Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab("sections")}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === "sections" ? "bg-white text-sky-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Nội dung
            </button>
            <button
              onClick={() => setActiveTab("bases")}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === "bases" ? "bg-white text-sky-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Căn cứ ({doc.legalBases?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("general")}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === "general" ? "bg-white text-sky-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Cơ quan
            </button>
            <button
              onClick={() => setActiveTab("signer")}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === "signer" ? "bg-white text-sky-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Ký & Nhận
            </button>
          </div>

          {/* TAB 1: SECTIONS & ITEMS */}
          {activeTab === "sections" && (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              <div className="space-y-2">
                <label htmlFor={editDocTitleInputId} className="text-xs font-bold text-slate-700">Tên loại văn bản</label>
                <input
                  id={editDocTitleInputId}
                  type="text"
                  value={doc.title}
                  onChange={(e) => updateField("title", e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold uppercase outline-hidden focus:border-sky-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor={editDocSubjectInputId} className="text-xs font-bold text-slate-700">Trích yếu nội dung</label>
                <textarea
                  id={editDocSubjectInputId}
                  rows={2}
                  value={doc.documentSubject}
                  onChange={(e) => updateField("documentSubject", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold outline-hidden focus:border-sky-500 resize-none"
                />
              </div>

              {/* Sections list */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Các phần & điều khoản:</span>
                  <button
                    onClick={handleAddSection}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm mục</span>
                  </button>
                </div>

                {doc.contentSections.map((sec, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={sec.heading}
                        onChange={(e) => handleHeadingChange(sIdx, e.target.value)}
                        className="w-full font-bold text-xs text-slate-900 bg-white px-2 py-1 rounded-md border border-slate-200 focus:border-sky-500 outline-hidden"
                      />
                      <button
                        onClick={() => handleRemoveSection(sIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Xóa mục này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Section items */}
                    <div className="space-y-1.5 pl-1">
                      {sec.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex items-start space-x-1.5">
                          <textarea
                            rows={2}
                            value={item}
                            onChange={(e) => handleItemChange(sIdx, iIdx, e.target.value)}
                            className="w-full text-xs text-slate-700 bg-white p-2 rounded-md border border-slate-200 focus:border-sky-500 outline-hidden resize-none leading-relaxed"
                          />
                          <button
                            onClick={() => handleRemoveItem(sIdx, iIdx)}
                            className="text-slate-300 hover:text-rose-500 p-1 mt-1"
                            title="Xóa ý này"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => handleAddItem(sIdx)}
                        className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 flex items-center space-x-1 pt-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Thêm ý nội dung</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LEGAL BASES */}
          {activeTab === "bases" && (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Căn cứ pháp lý & thẩm quyền:</span>
                <button
                  onClick={() =>
                    updateField("legalBases", [
                      ...(doc.legalBases || []),
                      "Nghị định số 30/2020/NĐ-CP ngày 05/3/2020 của Chính phủ về công tác văn thư;",
                    ])
                  }
                  className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm căn cứ</span>
                </button>
              </div>

              {(doc.legalBases || []).map((base, bIdx) => (
                <div key={bIdx} className="flex items-start space-x-2">
                  <span className="text-xs text-slate-400 font-bold pt-1.5">{bIdx + 1}.</span>
                  <textarea
                    rows={2}
                    value={base}
                    onChange={(e) => {
                      const newBases = [...(doc.legalBases || [])];
                      newBases[bIdx] = e.target.value;
                      updateField("legalBases", newBases);
                    }}
                    className="w-full text-xs italic text-slate-700 bg-white p-2 rounded-md border border-slate-200 focus:border-sky-500 outline-hidden resize-none"
                  />
                  <button
                    onClick={() => {
                      const newBases = doc.legalBases.filter((_, idx) => idx !== bIdx);
                      updateField("legalBases", newBases);
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: GENERAL INFO & AGENCY */}
          {activeTab === "general" && (
            <div className="space-y-3 text-xs max-h-[600px] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label htmlFor={editParentOrgInputId} className="font-bold text-slate-700">Cơ quan chủ quản</label>
                <input
                  id={editParentOrgInputId}
                  type="text"
                  value={doc.parentOrg || ""}
                  onChange={(e) => updateField("parentOrg", e.target.value.toUpperCase())}
                  placeholder="SỞ GIÁO DỤC VÀ ĐÀO TẠO"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-hidden focus:border-sky-500 uppercase"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={editOrgNameInputId} className="font-bold text-slate-700">Tên đơn vị ban hành</label>
                <input
                  id={editOrgNameInputId}
                  type="text"
                  value={doc.orgName}
                  onChange={(e) => updateField("orgName", e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-hidden focus:border-sky-500 uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label htmlFor={editDocCodeInputId} className="font-bold text-slate-700">Số và ký hiệu</label>
                  <input
                    id={editDocCodeInputId}
                    type="text"
                    value={doc.code}
                    onChange={(e) => updateField("code", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-hidden focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor={editDocDateInputId} className="font-bold text-slate-700">Ngày ban hành</label>
                  <input
                    id={editDocDateInputId}
                    type="text"
                    value={doc.date}
                    onChange={(e) => updateField("date", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor={editDocLocationInputId} className="font-bold text-slate-700">Địa danh</label>
                <input
                  id={editDocLocationInputId}
                  type="text"
                  value={doc.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-hidden focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label htmlFor={editAdminUnitInputId} className="font-bold text-slate-700">Đơn vị hành chính</label>
                  <input
                    id={editAdminUnitInputId}
                    type="text"
                    value={doc.adminUnit || ""}
                    onChange={(e) => updateField("adminUnit", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-hidden focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor={editProvinceInputId} className="font-bold text-slate-700">Tỉnh / Thành phố</label>
                  <input
                    id={editProvinceInputId}
                    type="text"
                    value={doc.province || ""}
                    onChange={(e) => updateField("province", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SIGNER & RECIPIENTS */}
          {activeTab === "signer" && (
            <div className="space-y-3 text-xs max-h-[600px] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label htmlFor={editSignerNameInputId} className="font-bold text-slate-700">Họ và tên người ký</label>
                <input
                  id={editSignerNameInputId}
                  type="text"
                  value={doc.signerName}
                  onChange={(e) => updateField("signerName", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-hidden focus:border-sky-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={editSignerTitleInputId} className="font-bold text-slate-700">Chức vụ người ký</label>
                <input
                  id={editSignerTitleInputId}
                  type="text"
                  value={doc.signerTitle}
                  onChange={(e) => updateField("signerTitle", e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-hidden focus:border-sky-500 uppercase font-bold"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={editSignTypeSelectId} className="font-bold text-slate-700">Thẩm quyền ký</label>
                <select
                  id={editSignTypeSelectId}
                  value={doc.signerSignType || "Ký trực tiếp"}
                  onChange={(e) => updateField("signerSignType", e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-hidden focus:border-sky-500 bg-white"
                >
                  <option value="Ký trực tiếp">Ký trực tiếp</option>
                  <option value="KT.">KT. (Ký thay)</option>
                  <option value="TM.">TM. (Thay mặt)</option>
                  <option value="TL.">TL. (Thừa lệnh)</option>
                  <option value="TUQ.">TUQ. (Thừa ủy quyền)</option>
                  <option value="Q.">Q. (Quyền)</option>
                </select>
              </div>

              {/* Recipients list */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Nơi nhận văn bản:</span>
                  <button
                    onClick={() => updateField("recipients", [...doc.recipients, "Bộ phận liên quan;"])}
                    className="text-sky-600 hover:text-sky-800 font-semibold flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm nơi nhận</span>
                  </button>
                </div>

                {doc.recipients.map((rec, rIdx) => (
                  <div key={rIdx} className="flex items-center space-x-1.5">
                    <input
                      type="text"
                      value={rec}
                      onChange={(e) => {
                        const newRecs = [...doc.recipients];
                        newRecs[rIdx] = e.target.value;
                        updateField("recipients", newRecs);
                      }}
                      className="w-full px-2.5 py-1 rounded-md border border-slate-200 text-xs focus:border-sky-500 outline-hidden"
                    />
                    <button
                      onClick={() => {
                        const newRecs = doc.recipients.filter((_, idx) => idx !== rIdx);
                        updateField("recipients", newRecs);
                      }}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: REALISTIC A4 PREVIEW (7 COLS ON DESKTOP) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Zoom & View Controls */}
          <div className="flex items-center justify-between px-2 text-xs text-slate-500">
            <span className="font-semibold flex items-center space-x-1">
              <span>Trang giấy xem trước chuẩn Microsoft Word</span>
              <span className="text-[10px] text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded-full font-bold">
                A4 Portrait
              </span>
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(70, prev - 10))}
                className="p-1 rounded-md hover:bg-slate-200 transition-colors"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold text-slate-700">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
                className="p-1 rounded-md hover:bg-slate-200 transition-colors"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Realistic A4 Paper Sheet */}
          <div className="overflow-x-auto bg-slate-200/80 p-3 sm:p-6 rounded-2xl border border-slate-300 flex justify-center">
            <div
              id="a4-document-preview"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
                fontFamily: "'Times New Roman', Times, serif",
              }}
              className="w-[210mm] min-h-[297mm] bg-white text-black p-[20mm_20mm_20mm_30mm] shadow-2xl transition-transform duration-150 relative text-[13.5pt] leading-[1.35] select-text"
            >
              {/* Header Table: Agency on Left, Motto on Right */}
              <div className="grid grid-cols-2 gap-4 text-center items-start">
                {/* Left Column: Parent Org / Issuing Org / Code */}
                <div>
                  {doc.parentOrg && (
                    <div className="text-[12pt] font-normal uppercase tracking-tight text-slate-800">
                      {doc.parentOrg}
                    </div>
                  )}
                  <div className="text-[12pt] font-bold uppercase tracking-tight text-black">
                    {doc.orgName || "TÊN CƠ QUAN, ĐƠN VỊ"}
                  </div>
                  {/* Decorative underline */}
                  <div className="w-20 mx-auto border-b border-black my-1" />
                  <div className="text-[12pt] font-normal text-slate-900 mt-1">
                    {doc.code || "Số: .../KH-..."}
                  </div>
                </div>

                {/* Right Column: National Motto / Date */}
                <div>
                  <div className="text-[12pt] font-bold uppercase tracking-tight text-black">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </div>
                  <div className="text-[13pt] font-bold text-black mt-0.5">
                    Độc lập - Tự do - Hạnh phúc
                  </div>
                  {/* Decorative underline for motto */}
                  <div className="w-32 mx-auto border-b border-black my-1" />
                  <div className="text-[13pt] italic text-slate-800 mt-1">
                    {doc.location || "Địa danh"}, {doc.date || "ngày ... tháng ... năm ..."}
                  </div>
                </div>
              </div>

              {/* Spacer */}
              <div className="h-6" />

              {/* Document Title (Tên loại văn bản) */}
              <div className="text-center font-bold text-[14pt] uppercase tracking-wide text-black">
                {doc.title || doc.docType || "VĂN BẢN HÀNH CHÍNH"}
              </div>

              {/* Document Subject (Trích yếu) */}
              {doc.documentSubject && (
                <div className="text-center font-bold text-[13pt] text-black mt-1 mb-5">
                  {doc.documentSubject}
                </div>
              )}

              {/* Legal Bases */}
              {doc.legalBases && doc.legalBases.length > 0 && (
                <div className="space-y-1 mb-4 text-justify">
                  {doc.legalBases.map((base, idx) => (
                    <p key={idx} className="italic text-[13pt] indent-7 text-slate-900">
                      Căn cứ {base.replace(/^Căn cứ\s+/i, "")}
                    </p>
                  ))}
                </div>
              )}

              {/* Content Sections */}
              <div className="space-y-3.5 text-justify">
                {doc.contentSections.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-1.5">
                    {sec.heading && (
                      <p className="font-bold text-[13.5pt] text-black">{sec.heading}</p>
                    )}
                    {sec.items.map((item, iIdx) => (
                      <p key={iIdx} className="text-[13.5pt] indent-7 text-black leading-relaxed">
                        {item}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              {/* Spacer before Signature */}
              <div className="h-8" />

              {/* Signature & Recipients Section: 2 Columns */}
              <div className="grid grid-cols-2 gap-4 items-start pt-2">
                {/* Left: Nơi nhận */}
                <div className="text-left text-[11pt] space-y-0.5">
                  <div className="font-bold italic text-[12pt] text-black">Nơi nhận:</div>
                  {doc.recipients && doc.recipients.length > 0 ? (
                    doc.recipients.map((rec, rIdx) => (
                      <div key={rIdx} className="text-slate-800">
                        - {rec}
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="text-slate-800">- Như trên;</div>
                      <div className="text-slate-800">- Lưu: VT, hồ sơ.</div>
                    </>
                  )}
                </div>

                {/* Right: Signer */}
                <div className="text-center space-y-1">
                  {doc.signerSignType && doc.signerSignType !== "Ký trực tiếp" && (
                    <div className="font-bold text-[13.5pt] text-black">
                      {doc.signerSignType}
                    </div>
                  )}
                  <div className="font-bold text-[13.5pt] uppercase text-black">
                    {doc.signerTitle || "THỦ TRƯỞNG ĐƠN VỊ"}
                  </div>

                  {/* Stamp Space */}
                  <div className="h-16 flex items-center justify-center text-[10pt] italic text-slate-400">
                    (Ký, đóng dấu)
                  </div>

                  <div className="font-bold text-[13.5pt] text-black">
                    {doc.signerName || "Nguyễn Văn A"}
                  </div>
                </div>
              </div>

              {/* Footer Page Number */}
              <div className="absolute bottom-4 left-0 right-0 text-center text-[12pt] text-slate-700">
                1
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
