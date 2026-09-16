import React from "react";
import { FileText, Sparkles, PlusCircle, Search, FileCheck, History, HelpCircle, Phone } from "lucide-react";

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNewDoc: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, onNewDoc }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            id="brand-logo-btn"
            onClick={() => onSelectTab("home")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="relative">
                <FileText className="w-5 h-5 text-white" />
                <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1.5 -right-1.5 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors">
                  PHÚC AI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                  NĐ 30/2020
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                SOẠN VĂN BẢN HÀNH CHÍNH
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              id="nav-home"
              onClick={() => onSelectTab("home")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === "home"
                  ? "bg-sky-50 text-sky-700 font-semibold"
                  : "text-slate-600 hover:text-sky-700 hover:bg-slate-50"
              }`}
            >
              Trang chủ
            </button>
            <button
              id="nav-create"
              onClick={onNewDoc}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentTab === "wizard" || currentTab === "editor"
                  ? "bg-sky-50 text-sky-700 font-semibold"
                  : "text-slate-600 hover:text-sky-700 hover:bg-slate-50"
              }`}
            >
              <PlusCircle className="w-4 h-4 text-sky-600" />
              <span>Soạn văn bản</span>
            </button>
            <button
              id="nav-check"
              onClick={() => onSelectTab("checker")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentTab === "checker"
                  ? "bg-sky-50 text-sky-700 font-semibold"
                  : "text-slate-600 hover:text-sky-700 hover:bg-slate-50"
              }`}
            >
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>Kiểm tra văn bản</span>
            </button>
            <button
              id="nav-templates"
              onClick={() => onSelectTab("templates")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentTab === "templates"
                  ? "bg-sky-50 text-sky-700 font-semibold"
                  : "text-slate-600 hover:text-sky-700 hover:bg-slate-50"
              }`}
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Mẫu văn bản</span>
            </button>
            <button
              id="nav-history"
              onClick={() => onSelectTab("history")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentTab === "history"
                  ? "bg-sky-50 text-sky-700 font-semibold"
                  : "text-slate-600 hover:text-sky-700 hover:bg-slate-50"
              }`}
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>Lịch sử</span>
            </button>
            <button
              id="nav-guide"
              onClick={() => onSelectTab("guide")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentTab === "guide"
                  ? "bg-sky-50 text-sky-700 font-semibold"
                  : "text-slate-600 hover:text-sky-700 hover:bg-slate-50"
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Hướng dẫn</span>
            </button>
          </nav>

          {/* Right Copyright & Zalo Info */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800 tracking-tight">
                © Nguyễn Văn Phúc
              </div>
              <a
                href="https://zalo.me/0949379531"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 transition-colors flex items-center justify-end space-x-1"
                title="Bấm để liên hệ Zalo 0949.379.531"
              >
                <Phone className="w-3 h-3 text-sky-500" />
                <span>Zalo: 0949.379.531</span>
              </a>
            </div>

            <button
              id="btn-primary-new-doc-header"
              onClick={onNewDoc}
              className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs sm:text-sm shadow-sm transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>+ Soạn văn bản</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
