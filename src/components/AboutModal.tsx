import React from "react";
import { X, Sparkles, Phone, ShieldCheck, Heart, FileText, CheckCircle2 } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-center">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo and Name */}
        <div className="space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/30">
            <Sparkles className="w-8 h-8 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            PHÚC AI – SOẠN VĂN BẢN HÀNH CHÍNH
          </h2>
          <p className="text-xs font-bold text-sky-700 uppercase tracking-wider">
            “Soạn nhanh – Đúng thể thức – Chuẩn định dạng – Dễ sử dụng”
          </p>
        </div>

        {/* Author and Copyright Information */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-700">
          <p className="font-bold text-slate-900 text-sm">
            © 2026 Nguyễn Văn Phúc – PHÚC AI
          </p>
          <p className="text-slate-600">
            Bản quyền thuộc Nguyễn Văn Phúc
          </p>
          <div className="pt-2">
            <a
              id="about-zalo-link"
              href="https://zalo.me/0949379531"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 active:scale-95 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Liên hệ mua App qua Zalo: 0949.379.531</span>
            </a>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="text-left text-xs text-slate-600 space-y-1.5 pt-1">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chuẩn Nghị định 30/2020/NĐ-CP của Chính phủ</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Xuất tệp Microsoft Word (.docx) chuẩn khổ A4</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chuyên biệt cho ngành giáo dục & quản lý trường học</span>
          </div>
        </div>

        {/* Legal warning */}
        <p className="text-[11px] text-slate-400 leading-relaxed text-center">
          PHÚC AI là công cụ hỗ trợ soạn thảo và chuẩn hóa văn bản. Người sử dụng chịu trách nhiệm kiểm tra tính chính xác của nội dung và căn cứ pháp lý trước khi ban hành.
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};
