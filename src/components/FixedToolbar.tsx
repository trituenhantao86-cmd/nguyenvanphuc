import React from "react";
import { Plus, FileText, FileCheck, History, HelpCircle, Phone, Info } from "lucide-react";

interface FixedToolbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNewDoc: () => void;
  onOpenAbout: () => void;
}

export const FixedToolbar: React.FC<FixedToolbarProps> = ({
  currentTab,
  onSelectTab,
  onNewDoc,
  onOpenAbout,
}) => {
  return (
    <aside aria-label="Thanh công cụ nhanh" className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[95vw]">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-2xl p-1.5 flex items-center space-x-1 text-white text-xs">
        {/* New Doc Button */}
        <button
          id="toolbar-new-doc"
          onClick={onNewDoc}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold shadow-md shadow-sky-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">Văn bản mới</span>
        </button>

        {/* Templates */}
        <button
          id="toolbar-templates"
          onClick={() => onSelectTab("templates")}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all ${
            currentTab === "templates"
              ? "bg-slate-800 text-sky-400 font-semibold"
              : "text-slate-300 hover:text-white hover:bg-slate-800/60"
          }`}
          title="Kho mẫu văn bản hành chính và trường học"
        >
          <FileText className="w-4 h-4 text-sky-400" />
          <span className="hidden md:inline">Mẫu văn bản</span>
        </button>

        {/* Check DOCX */}
        <button
          id="toolbar-check"
          onClick={() => onSelectTab("checker")}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all ${
            currentTab === "checker"
              ? "bg-slate-800 text-sky-400 font-semibold"
              : "text-slate-300 hover:text-white hover:bg-slate-800/60"
          }`}
          title="Tải lên và kiểm tra file Word (.docx)"
        >
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden md:inline">Kiểm tra</span>
        </button>

        {/* History */}
        <button
          id="toolbar-history"
          onClick={() => onSelectTab("history")}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all ${
            currentTab === "history"
              ? "bg-slate-800 text-sky-400 font-semibold"
              : "text-slate-300 hover:text-white hover:bg-slate-800/60"
          }`}
          title="Văn bản đã tạo trong phiên làm việc"
        >
          <History className="w-4 h-4 text-amber-400" />
          <span className="hidden md:inline">Lịch sử</span>
        </button>

        {/* About */}
        <button
          id="toolbar-about"
          onClick={onOpenAbout}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
          title="Thông tin về PHÚC AI & Tác giả"
        >
          <Info className="w-4 h-4 text-indigo-400" />
          <span className="hidden md:inline">Giới thiệu</span>
        </button>

        {/* Guide */}
        <button
          id="toolbar-guide"
          onClick={() => onSelectTab("guide")}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all ${
            currentTab === "guide"
              ? "bg-slate-800 text-sky-400 font-semibold"
              : "text-slate-300 hover:text-white hover:bg-slate-800/60"
          }`}
          title="Quy trình 4 bước và căn cứ pháp lý"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Hướng dẫn</span>
        </button>

        {/* Quick Zalo Contact */}
        <a
          id="toolbar-zalo"
          href="https://zalo.me/0949379531"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1 px-2.5 py-2 rounded-xl text-amber-300 hover:text-amber-200 hover:bg-slate-800/60 transition-all"
          title="Mua App qua Zalo: 0949.379.531"
        >
          <Phone className="w-3.5 h-3.5" />
          <span className="hidden lg:inline text-[11px] font-bold">Zalo: 0949.379.531</span>
        </a>
      </div>
    </aside>
  );
};
