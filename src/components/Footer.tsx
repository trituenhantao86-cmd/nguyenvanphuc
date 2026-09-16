import React from "react";
import { ShieldCheck, Lock, Phone, Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-10 pb-20 md:pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top section with columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Slogan */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black text-white tracking-tight">PHÚC AI</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-400 font-semibold border border-sky-500/30">
                Chính phủ điện tử
              </span>
            </div>
            <p className="text-sm font-semibold text-sky-400">
              “Soạn nhanh – Đúng thể thức – Chuẩn định dạng – Dễ sử dụng”
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ứng dụng trí tuệ nhân tạo chuyên biệt cho giáo viên, cán bộ quản lý trường học và đơn vị hành chính Việt Nam theo Nghị định 30/2020/NĐ-CP.
            </p>
          </div>

          {/* Legal & Security Disclaimer */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Cảnh báo pháp lý & Bảo mật</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              PHÚC AI là công cụ hỗ trợ soạn thảo và chuẩn hóa văn bản. Người sử dụng chịu trách nhiệm kiểm tra tính chính xác của nội dung, căn cứ pháp lý, thẩm quyền, thông tin hành chính và quyết định việc ban hành văn bản.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-rose-300 bg-rose-950/40 p-2 rounded-lg border border-rose-800/40">
              <Lock className="w-3.5 h-3.5 shrink-0 text-rose-400" />
              <span>
                Không nhập thông tin mật, bí mật nhà nước, thông tin cá nhân nhạy cảm hoặc dữ liệu không cần thiết.
              </span>
            </div>
          </div>

          {/* Contact & Author Information */}
          <div className="space-y-3 md:pl-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Bản quyền & Liên hệ mua App
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="font-bold text-white text-base">
                © Nguyễn Văn Phúc
              </p>
              <p className="text-slate-400">
                Bản quyền thuộc Nguyễn Văn Phúc
              </p>
              <div className="pt-2">
                <a
                  id="footer-zalo-link"
                  href="https://zalo.me/0949379531"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-900/30 transition-all hover:scale-105"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Liên hệ mua App qua Zalo: 0949.379.531</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Copyright Notice Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-2 sm:space-y-0">
          <div className="text-center sm:text-left space-y-1">
            <p className="font-bold text-slate-200 text-sm">
              © 2026 Nguyễn Văn Phúc – PHÚC AI
            </p>
            <p className="text-sky-400 font-medium">
              Bản quyền thuộc Nguyễn Văn Phúc | Liên hệ mua App qua Zalo: 0949.379.531
            </p>
          </div>
          <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chuẩn Nghị định 30/2020/NĐ-CP & Mô hình chính quyền hiện hành</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
