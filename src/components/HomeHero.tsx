import React from "react";
import { Sparkles, FilePlus, FileCheck, Layers, Bot, Award, Landmark, Download, ArrowRight, CheckCircle2, ShieldCheck, School } from "lucide-react";

interface HomeHeroProps {
  onStartNew: () => void;
  onOpenChecker: () => void;
  onViewTemplates: () => void;
  onSelectCategory: (category: string) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onStartNew,
  onOpenChecker,
  onViewTemplates,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-12 py-6 sm:py-10">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50 via-white to-blue-50/40 border border-sky-100 p-6 sm:p-10 lg:p-12 shadow-sm text-center">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-sky-300/20 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 border border-sky-200 text-sky-800 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
            <span>Trí tuệ nhân tạo chuyên biệt công tác văn thư & trường học</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Soạn văn bản hành chính bằng{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600">
              PHÚC AI
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-xl font-medium text-slate-600 leading-relaxed">
            Nhập yêu cầu – AI soạn thảo – Kiểm tra thể thức – Xuất Word
          </p>

          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Giải pháp chuyên nghiệp giúp giáo viên, cán bộ quản lý và nhân viên văn thư tạo lập nhanh chóng các văn bản Kế hoạch, Quyết định, Báo cáo, Tờ trình chuẩn theo <strong className="text-slate-700">Nghị định 30/2020/NĐ-CP</strong> và mô hình hành chính hiện hành.
          </p>

          {/* 3 Main Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              id="hero-btn-new-doc"
              onClick={onStartNew}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-base shadow-lg shadow-sky-600/25 active:scale-98 transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <FilePlus className="w-5 h-5 text-amber-300" />
              <span>+ Soạn văn bản mới</span>
            </button>

            <button
              id="hero-btn-check-doc"
              onClick={onOpenChecker}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-xs hover:border-slate-300 active:scale-98 transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <span>Kiểm tra văn bản (.docx)</span>
            </button>

            <button
              id="hero-btn-templates"
              onClick={onViewTemplates}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-sky-50/80 hover:bg-sky-100 text-sky-800 font-bold text-base border border-sky-200 active:scale-98 transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <Layers className="w-5 h-5 text-sky-600" />
              <span>Xem mẫu</span>
            </button>
          </div>

          {/* Fast Category Shortcuts */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-600 font-medium">Gợi ý nhanh:</span>
            <button
              onClick={() => onSelectCategory("school")}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-300 text-slate-700 font-medium hover:text-sky-700 transition-colors flex items-center space-x-1"
            >
              <School className="w-3 h-3 text-sky-600" />
              <span>Kế hoạch năm học</span>
            </button>
            <button
              onClick={() => onSelectCategory("preschool")}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-300 text-slate-700 font-medium hover:text-sky-700 transition-colors"
            >
              <span>Mầm non / STEAM</span>
            </button>
            <button
              onClick={() => onSelectCategory("management")}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-300 text-slate-700 font-medium hover:text-sky-700 transition-colors"
            >
              <span>Quyết định thành lập ban</span>
            </button>
            <button
              onClick={() => onSelectCategory("report")}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-300 text-slate-700 font-medium hover:text-sky-700 transition-colors"
            >
              <span>Báo cáo sơ kết</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Core Features Section */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Tính năng vượt trội cho văn thư & quản lý giáo dục
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Được thiết kế tỉ mỉ bởi tác giả Nguyễn Văn Phúc nhằm tiết kiệm 80% thời gian soạn thảo văn bản
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Feature 1 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">AI soạn thảo</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tự động phân tích yêu cầu tự nhiên, xác định bố cục chuẩn mục đích, nhiệm vụ, tổ chức thực hiện, không tự ý bịa đặt thông tin.
            </p>
            <div className="flex items-center text-[11px] font-semibold text-sky-600 space-x-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Chuyên sâu sư phạm & quản lý</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Chuẩn thể thức</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tuân thủ nghiêm ngặt Nghị định 30/2020/NĐ-CP: Quốc hiệu, Tiêu ngữ, số ký hiệu, trích yếu, chữ ký, nơi nhận, cỡ chữ Times New Roman.
            </p>
            <div className="flex items-center text-[11px] font-semibold text-blue-600 space-x-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Căn lề 20-30mm tiêu chuẩn</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Kiểm tra hành chính</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bộ quét đặc biệt phân tích ngữ cảnh, phát hiện các cơ cấu hành chính cấp huyện cũ đã được tổ chức lại để cảnh báo kịp thời.
            </p>
            <div className="flex items-center text-[11px] font-semibold text-indigo-600 space-x-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Quy tắc không còn cấp huyện</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Xuất Word (.docx)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tạo tệp Word nhị phân tiêu chuẩn Microsoft Word (.docx), định dạng A4, lề chuẩn, bảng header chữ ký hoàn mỹ, không phải file html đổi đuôi.
            </p>
            <div className="flex items-center text-[11px] font-semibold text-emerald-600 space-x-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tải file về máy mở ngay</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Support Strip */}
      <section className="rounded-2xl bg-slate-50 border border-slate-200/60 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-black">
            P
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">
              PHÚC AI – SOẠN VĂN BẢN HÀNH CHÍNH
            </p>
            <p className="text-slate-500">
              © Nguyễn Văn Phúc • Hỗ trợ kỹ thuật & Mua App Zalo: 0949.379.531
            </p>
          </div>
        </div>

        <button
          onClick={onStartNew}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center space-x-1.5 transition-all shadow-xs"
        >
          <span>Bắt đầu ngay</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>
    </div>
  );
};
