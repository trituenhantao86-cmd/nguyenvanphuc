import React from "react";
import { Sparkles, FilePlus, FileCheck, Layers, Bot, Award, Landmark, Download, ArrowRight, CheckCircle2, ShieldCheck, School, Zap, Lightbulb, Rocket } from "lucide-react";

interface HomeHeroProps {
  onStartNew: () => void;
  onOpenChecker: () => void;
  onViewTemplates: () => void;
  onSelectCategory: (category: string) => void;
  onStartAutoIdea?: (prompt?: string, docType?: string) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onStartNew,
  onOpenChecker,
  onViewTemplates,
  onSelectCategory,
  onStartAutoIdea,
}) => {
  return (
    <div className="space-y-12 py-6 sm:py-10">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50 via-white to-blue-50/40 border border-sky-100 p-6 sm:p-10 lg:p-12 shadow-sm text-center">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-sky-300/20 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Chế độ tự động soạn theo ý tưởng – Không cần nhập nội dung</span>
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
            Chọn ý tưởng – AI tự động soạn thảo dài & chi tiết – Chuẩn Nghị định 30 – Xuất Word
          </p>

          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Giải pháp chuyên nghiệp giúp giáo viên, cán bộ quản lý và nhân viên văn thư tạo lập nhanh chóng các văn bản Kế hoạch, Quyết định, Báo cáo, Tờ trình chuẩn theo <strong className="text-slate-700">Nghị định 30/2020/NĐ-CP</strong> với đầy đủ 5 - 7 mục lớn, phụ lục, kinh phí và phân công trách nhiệm mà không cần tự gõ nội dung.
          </p>

          {/* Main Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              id="hero-btn-auto-idea"
              onClick={() => onStartAutoIdea ? onStartAutoIdea() : onStartNew()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white font-black text-base shadow-lg shadow-emerald-600/25 active:scale-98 transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <Zap className="w-5 h-5 text-amber-300 animate-bounce" />
              <span>⚡ Soạn tự động theo ý tưởng (1-Click)</span>
            </button>

            <button
              id="hero-btn-new-doc"
              onClick={onStartNew}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-base shadow-lg shadow-sky-600/25 active:scale-98 transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <FilePlus className="w-5 h-5 text-amber-300" />
              <span>Soạn từng bước</span>
            </button>

            <button
              id="hero-btn-check-doc"
              onClick={onOpenChecker}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-xs hover:border-slate-300 active:scale-98 transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <span>Kiểm tra (.docx)</span>
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

          {/* Fast 1-Click Idea Shortcuts */}
          <div className="pt-3 space-y-2">
            <span className="text-xs text-slate-600 font-bold flex items-center justify-center space-x-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Bấm soạn ngay theo ý tưởng chuyên sâu (Dài & Chi tiết nhất):</span>
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <button
                onClick={() =>
                  onStartAutoIdea
                    ? onStartAutoIdea("Xây dựng kế hoạch thực hiện nhiệm vụ năm học toàn diện với các mục tiêu: nâng cao chất lượng giáo dục mũi nhọn và đại trà, đẩy mạnh chuyển đổi số trong dạy học và quản lý, xây dựng trường học hạnh phúc, tăng cường giáo dục đạo đức lối sống cho học sinh.", "Kế hoạch")
                    : onStartNew()
                }
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-sky-300 text-slate-800 font-medium hover:text-sky-700 shadow-2xs hover:bg-sky-50/60 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <School className="w-3.5 h-3.5 text-sky-600" />
                <span>Kế hoạch năm học</span>
              </button>

              <button
                onClick={() =>
                  onStartAutoIdea
                    ? onStartAutoIdea("Ban hành quyết định kiện toàn Ban Chỉ đạo chuyển đổi số, ứng dụng công nghệ thông tin và trí tuệ nhân tạo (AI) trong công tác quản lý điều hành và đổi mới phương pháp giảng dạy.", "Quyết định")
                    : onStartNew()
                }
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 text-slate-800 font-medium hover:text-blue-700 shadow-2xs hover:bg-blue-50/60 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-blue-600" />
                <span>Quyết định Chuyển đổi số & AI</span>
              </button>

              <button
                onClick={() =>
                  onStartAutoIdea
                    ? onStartAutoIdea("Lập kế hoạch triển khai chuyên đề ứng dụng phương pháp giáo dục tiên tiến STEAM trong trường mầm non theo từng khối lớp (nhà trẻ, mẫu giáo bé, mẫu giáo nhỡ, mẫu giáo lớn).", "Kế hoạch")
                    : onStartNew()
                }
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-pink-300 text-slate-800 font-medium hover:text-pink-700 shadow-2xs hover:bg-pink-50/60 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                <span>STEAM Mầm non</span>
              </button>

              <button
                onClick={() =>
                  onStartAutoIdea
                    ? onStartAutoIdea("Soạn thảo báo cáo toàn diện sơ kết học kỳ I và phương hướng nhiệm vụ trọng tâm học kỳ II trên tất cả các mặt công tác chuyên môn, nền nếp, thi đua.", "Báo cáo")
                    : onStartNew()
                }
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-slate-800 font-medium hover:text-emerald-700 shadow-2xs hover:bg-emerald-50/60 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>Báo cáo sơ kết HK1</span>
              </button>

              <button
                onClick={() =>
                  onStartAutoIdea
                    ? onStartAutoIdea("Soạn tờ trình gửi cơ quan cấp có thẩm quyền xin phê duyệt chủ trương và phân bổ kinh phí đầu tư, nâng cấp thư viện nhà trường thành Thư viện số thông minh và không gian văn hóa đọc hiện đại.", "Tờ trình")
                    : onStartNew()
                }
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-amber-300 text-slate-800 font-medium hover:text-amber-700 shadow-2xs hover:bg-amber-50/60 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Landmark className="w-3.5 h-3.5 text-amber-600" />
                <span>Tờ trình CSVC & Thư viện số</span>
              </button>
            </div>
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
