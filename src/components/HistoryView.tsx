import React from "react";
import { DocumentData } from "../types";
import { generateDocxBlob, generateFileName, downloadDocx } from "../utils/docxGenerator";
import {
  History,
  FileText,
  ArrowRight,
  Download,
  Trash2,
  Calendar,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";

interface HistoryViewProps {
  documents: DocumentData[];
  onOpenDoc: (doc: DocumentData) => void;
  onDeleteDoc: (id: string) => void;
  onClearAll: () => void;
  onNewDoc: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  documents,
  onOpenDoc,
  onDeleteDoc,
  onClearAll,
  onNewDoc,
}) => {
  const handleDownload = async (doc: DocumentData) => {
    try {
      const blob = await generateDocxBlob(doc);
      const filename = generateFileName(doc);
      downloadDocx(blob, filename);
    } catch (e: any) {
      alert("Lỗi tải file Word: " + e.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <History className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Lịch sử văn bản đã tạo
            </h1>
            <p className="text-xs text-slate-500">
              Các văn bản được lưu tự động trong trình duyệt của bạn ({documents.length} bản ghi).
            </p>
          </div>
        </div>

        {documents.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử soạn thảo?")) {
                onClearAll();
              }
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center space-x-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa tất cả</span>
          </button>
        )}
      </div>

      {/* List or Empty State */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Chưa có văn bản nào</h3>
            <p className="text-xs text-slate-500 mt-1">
              Bắt đầu soạn thảo văn bản mới hoặc chọn một mẫu từ thư viện để trải nghiệm.
            </p>
          </div>
          <button
            onClick={onNewDoc}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 inline-flex items-center space-x-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Soạn văn bản ngay</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-sky-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100">
                    {item.docType}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </span>
                  {item.auditResult && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{item.auditResult.totalScore}/100đ</span>
                    </span>
                  )}
                </div>

                <h2 className="text-base font-bold text-slate-900 leading-snug">
                  {item.title || item.docType}: {item.documentSubject || "Không có trích yếu"}
                </h2>

                <p className="text-xs text-slate-500">
                  {item.orgName} • Người ký: {item.signerName} ({item.signerTitle || "Hiệu trưởng"})
                </p>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleDownload(item)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-sky-700 hover:bg-slate-50 transition-colors"
                  title="Tải file Word .docx"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (confirm("Xóa văn bản này khỏi lịch sử?")) {
                      onDeleteDoc(item.id);
                    }
                  }}
                  className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenDoc(item)}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center space-x-1 shadow-xs active:scale-95 transition-all"
                >
                  <span>Mở chỉnh sửa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
