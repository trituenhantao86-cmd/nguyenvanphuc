import React, { useState, useId } from "react";
import { TEMPLATES_DATABASE, buildDocumentFromTemplate } from "../data/templates";
import { DocTemplate, DocumentData, DocCategory } from "../types";
import { generateDocxBlob, generateFileName, downloadDocx } from "../utils/docxGenerator";
import {
  Search,
  BookOpen,
  ArrowRight,
  Download,
  School,
  FileText,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface TemplatesGalleryProps {
  onUseTemplate: (template: DocTemplate) => void;
  selectedCategoryFilter?: string;
}

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({
  onUseTemplate,
  selectedCategoryFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategoryFilter || "all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const searchInputId = useId();

  const categories = [
    { id: "all", label: "Tất cả mẫu" },
    { id: "school", label: "Trường học" },
    { id: "preschool", label: "Mầm non" },
    { id: "management", label: "Văn bản quản lý" },
    { id: "report", label: "Báo cáo" },
    { id: "other", label: "Hành chính khác" },
  ];

  const filteredTemplates = TEMPLATES_DATABASE.filter((tpl) => {
    const matchCategory = activeCategory === "all" || tpl.category === activeCategory;
    const matchSearch =
      searchTerm.trim() === "" ||
      tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.docType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleDownloadSample = async (tpl: DocTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadingId(tpl.id);
    try {
      const doc = buildDocumentFromTemplate(tpl, `tpl-${tpl.id}`);
      const blob = await generateDocxBlob(doc);
      const filename = generateFileName(doc);
      downloadDocx(blob, filename);
    } catch (err: any) {
      alert("Lỗi tải file: " + (err.message || ""));
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Kho mẫu văn bản hành chính & trường học
            </h1>
            <p className="text-xs text-slate-500">
              Được chuẩn hóa sẵn theo Nghị định 30/2020/NĐ-CP và đặc thù quản lý giáo dục.
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative pt-2">
          <label htmlFor={searchInputId} className="sr-only">
            Tìm kiếm mẫu văn bản
          </label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 mt-1" />
          <input
            id={searchInputId}
            type="text"
            placeholder="Tìm kiếm mẫu văn bản (Kế hoạch năm học, STEAM mầm non, Quyết định, Báo cáo, Tờ trình...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => onUseTemplate(tpl)}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all space-y-4 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100">
                  {tpl.docType}
                </span>
                <span className="text-[11px] text-slate-400">
                  {tpl.targetAudience}
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 leading-snug">
                {tpl.name}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {tpl.description}
              </p>

              {/* Structure Outline */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Bố cục chuẩn:
                </span>
                <div className="flex flex-wrap gap-1 text-[11px] text-slate-700 font-medium">
                  {tpl.structure.map((item, idx) => (
                    <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
              <button
                onClick={(e) => handleDownloadSample(tpl, e)}
                disabled={downloadingId === tpl.id}
                className="text-slate-600 hover:text-sky-700 font-semibold flex items-center space-x-1 p-1"
                title="Tải nhanh file .docx mẫu"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadingId === tpl.id ? "Đang tạo..." : "Tải file .docx"}</span>
              </button>

              <button
                onClick={() => onUseTemplate(tpl)}
                className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center space-x-1 shadow-xs active:scale-95 transition-all"
              >
                <span>Dùng mẫu này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
