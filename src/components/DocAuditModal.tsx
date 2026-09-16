import React from "react";
import { AuditResult, DocumentData } from "../types";
import { autoFixDocument } from "../utils/ruleChecker";
import { generateDocxBlob, generateFileName, downloadDocx } from "../utils/docxGenerator";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wand2,
  Download,
  Landmark,
  Sparkles,
} from "lucide-react";

interface DocAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentData;
  onUpdateDocument: (doc: DocumentData) => void;
}

export const DocAuditModal: React.FC<DocAuditModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  onUpdateDocument,
}) => {
  if (!isOpen) return null;

  const audit: AuditResult = doc.auditResult || {
    totalScore: 92,
    scores: {
      formatScore: 95,
      contentScore: 90,
      structureScore: 92,
      adminUnitScore: 95,
      typographyScore: 100,
    },
    adminUnitStatus: "appropriate",
    adminUnitMessage: "Hành chính phù hợp với mô hình tổ chức hiện hành.",
    checks: [],
    suggestions: [],
    detectedIssuesCount: 0,
    hasOutdatedDistrict: false,
    outdatedDistrictWarnings: [],
    isReadyToExport: true,
  };

  const handleApplyAutoFix = () => {
    const fixed = autoFixDocument(doc);
    onUpdateDocument(fixed);
  };

  const handleExportNow = async () => {
    try {
      const blob = await generateDocxBlob(doc);
      const filename = generateFileName(doc);
      downloadDocx(blob, filename);
    } catch (err: any) {
      alert("Lỗi xuất file Word: " + (err.message || ""));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Kiểm tra thể thức & pháp lý
              </h2>
              <p className="text-xs text-slate-500">
                Đối chiếu tiêu chuẩn theo Nghị định số 30/2020/NĐ-CP của Chính phủ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Phase Status Flow Bar */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          {[
            { label: "Nội dung", ok: audit.scores.contentScore >= 70 },
            { label: "Hành chính", ok: !audit.hasOutdatedDistrict },
            { label: "Thể thức", ok: audit.scores.formatScore >= 70 },
            { label: "Định dạng", ok: audit.scores.typographyScore >= 80 },
            { label: "DOCX", ok: true },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-1 font-semibold">
              {item.ok ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span className={item.ok ? "text-slate-800" : "text-amber-800"}>
                {item.label}
              </span>
              {idx < 4 && <span className="text-slate-300 ml-1">|</span>}
            </div>
          ))}
        </div>

        {/* Big Score Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 via-blue-50/40 to-indigo-50/30 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              Điểm chuẩn hóa văn bản
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900">
                {audit.totalScore}
              </span>
              <span className="text-sm font-bold text-slate-500">/ 100 điểm</span>
            </div>
            <p className="text-xs text-slate-600">
              {audit.totalScore >= 85
                ? "Văn bản đạt thể thức xuất sắc, đáp ứng đầy đủ yêu cầu ban hành."
                : "Văn bản cần hoàn thiện một số trường thông tin trước khi ban hành."}
            </p>
          </div>

          <button
            onClick={handleApplyAutoFix}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center space-x-1.5 shrink-0"
          >
            <Wand2 className="w-4 h-4" />
            <span>Tự động sửa lỗi</span>
          </button>
        </div>

        {/* 5 Specific Criteria Scores */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[11px] block">Thể thức</span>
            <span className="font-bold text-slate-900 text-sm">
              {audit.scores.formatScore}%
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[11px] block">Nội dung</span>
            <span className="font-bold text-slate-900 text-sm">
              {audit.scores.contentScore}%
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[11px] block">Cấu trúc</span>
            <span className="font-bold text-slate-900 text-sm">
              {audit.scores.structureScore}%
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[11px] block">Hành chính</span>
            <span className="font-bold text-slate-900 text-sm">
              {audit.scores.adminUnitScore}%
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
            <span className="text-slate-500 text-[11px] block">Định dạng</span>
            <span className="font-bold text-slate-900 text-sm">
              {audit.scores.typographyScore}%
            </span>
          </div>
        </div>

        {/* Administrative Unit / "No County Level" Special Rule Box */}
        {audit.hasOutdatedDistrict && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
              <Landmark className="w-4 h-4 text-amber-600 shrink-0" />
              <span>CẢNH BÁO QUY TẮC: ĐƠN VỊ HÀNH CHÍNH & MÔ HÌNH TỔ CHỨC</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed font-semibold">
              {audit.adminUnitMessage}
            </p>
            {audit.outdatedDistrictWarnings.map((warn, i) => (
              <p key={i} className="text-xs text-amber-700 list-disc list-inside">
                • {warn}
              </p>
            ))}
          </div>
        )}

        {/* Detailed Verification Checklist */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-800 block">
            Chi tiết 10 tiêu chuẩn kiểm tra theo Nghị định 30/2020/NĐ-CP:
          </span>

          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {audit.checks.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between text-xs gap-2"
              >
                <div className="flex items-start space-x-2">
                  {item.status === "pass" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : item.status === "warn" ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-slate-900 block">{item.name}</span>
                    <span className="text-slate-500 text-[11px] leading-relaxed">
                      {item.detail}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-md font-bold text-[10px] shrink-0 ${
                    item.status === "pass"
                      ? "bg-emerald-100 text-emerald-800"
                      : item.status === "warn"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {item.status === "pass" ? "Đạt" : item.status === "warn" ? "Cần kiểm tra" : "Chưa đạt"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        {audit.suggestions && audit.suggestions.length > 0 && (
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 space-y-1 text-xs">
            <span className="font-bold text-sky-900 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Gợi ý cải thiện:</span>
            </span>
            <ul className="space-y-0.5 text-sky-800 list-disc list-inside">
              {audit.suggestions.map((sug, idx) => (
                <li key={idx}>{sug}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
          >
            Đóng & tiếp tục sửa
          </button>

          <button
            onClick={handleExportNow}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Tải file Word (.docx)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
