/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { DocumentData, DocTemplate, WizardDraft } from "./types";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { FixedToolbar } from "./components/FixedToolbar";
import { HomeHero } from "./components/HomeHero";
import { DocWizard } from "./components/DocWizard";
import { DocEditor } from "./components/DocEditor";
import { DocxUploadChecker } from "./components/DocxUploadChecker";
import { TemplatesGallery } from "./components/TemplatesGallery";
import { HistoryView } from "./components/HistoryView";
import { DocAuditModal } from "./components/DocAuditModal";
import { GuideModal } from "./components/GuideModal";
import { AboutModal } from "./components/AboutModal";
import { TEMPLATES_DATABASE, buildDocumentFromTemplate } from "./data/templates";
import { auditAdministrativeDocument } from "./utils/ruleChecker";

const STORAGE_KEY = "phuc_ai_documents_history_v1";

export default function App() {
  // Navigation tab state: "home" | "wizard" | "editor" | "checker" | "templates" | "history" | "guide"
  const [currentTab, setCurrentTab] = useState<string>("home");

  // Active document in editor
  const [activeDocument, setActiveDocument] = useState<DocumentData | null>(null);

  // Wizard initial draft (when starting from template or category)
  const [wizardDraft, setWizardDraft] = useState<Partial<WizardDraft> | undefined>(undefined);

  // Templates category filter
  const [templateFilter, setTemplateFilter] = useState<string>("all");

  // Modals state
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);

  // History state saved in localStorage
  const [documentsHistory, setDocumentsHistory] = useState<DocumentData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
    // Default seed document from templates
    const initialDoc = buildDocumentFromTemplate(TEMPLATES_DATABASE[0], "doc-seed-1");
    initialDoc.auditResult = auditAdministrativeDocument(initialDoc);
    return [initialDoc];
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documentsHistory));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [documentsHistory]);

  // Handler: Start New Document from scratch
  const handleStartNewDoc = () => {
    setWizardDraft(undefined);
    setCurrentTab("wizard");
  };

  // Handler: 1-Click Auto Idea (No typing needed, maximum length & detail)
  const handleStartAutoIdea = (prompt?: string, docType?: string) => {
    const currentYear = new Date().getFullYear();
    const todayStr = `ngày ${new Date().getDate().toString().padStart(2, "0")} tháng ${(new Date().getMonth() + 1).toString().padStart(2, "0")} năm ${currentYear}`;
    const selectedDocType = docType || "Kế hoạch";
    const selectedPrompt =
      prompt ||
      "Xây dựng kế hoạch thực hiện nhiệm vụ năm học toàn diện với các mục tiêu: nâng cao chất lượng giáo dục mũi nhọn và đại trà, đẩy mạnh chuyển đổi số trong dạy học và quản lý, xây dựng trường học hạnh phúc, tăng cường giáo dục đạo đức lối sống cho học sinh.";

    setWizardDraft({
      docType: selectedDocType,
      category: "school",
      parentOrg: "SỞ GIÁO DỤC VÀ ĐÀO TẠO",
      orgName: "TRƯỜNG THCS NGUYỄN DU",
      orgType: "Trường THCS",
      address: "Số 12 Đường Hùng Vương",
      location: "Hà Nội",
      province: "Thành phố Hà Nội",
      adminUnit: "Phường Điện Biên",
      code: `Số: .../${selectedDocType === "Kế hoạch" ? "KH" : selectedDocType === "Quyết định" ? "QĐ" : selectedDocType === "Báo cáo" ? "BC" : "TT"}-THCSND`,
      date: todayStr,
      signerName: "Trần Văn An",
      signerRole: "Hiệu trưởng",
      signType: "Ký trực tiếp",
      prompt: selectedPrompt,
      detailLevel: "Rất chi tiết",
      style: "Hành chính chuẩn",
      audience: "Nhà trường",
      initialStep: 6,
      autoStart: true,
    });
    setCurrentTab("wizard");
  };

  // Handler: Start from Home category shortcut
  const handleSelectHomeCategory = (cat: string) => {
    setTemplateFilter(cat);
    setCurrentTab("templates");
  };

  // Handler: Wizard completes generation
  const handleWizardComplete = (newDoc: DocumentData) => {
    setActiveDocument(newDoc);
    // Add to history (unshift)
    setDocumentsHistory((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
    setCurrentTab("editor");
  };

  // Handler: Open template
  const handleUseTemplate = (tpl: DocTemplate) => {
    const docData = buildDocumentFromTemplate(tpl);
    docData.auditResult = auditAdministrativeDocument(docData);
    setActiveDocument(docData);
    setDocumentsHistory((prev) => [docData, ...prev]);
    setCurrentTab("editor");
  };

  // Handler: Open existing document in Editor
  const handleOpenDocInEditor = (doc: DocumentData) => {
    setActiveDocument(doc);
    setCurrentTab("editor");
  };

  // Handler: Update active document in Editor
  const handleUpdateDocument = (updated: DocumentData) => {
    setActiveDocument(updated);
    setDocumentsHistory((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  // Handler: Delete doc from history
  const handleDeleteHistoryDoc = (id: string) => {
    setDocumentsHistory((prev) => prev.filter((d) => d.id !== id));
    if (activeDocument && activeDocument.id === id) {
      setActiveDocument(null);
      setCurrentTab("home");
    }
  };

  // Handler: Clear all history
  const handleClearAllHistory = () => {
    setDocumentsHistory([]);
    setActiveDocument(null);
    setCurrentTab("home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
      {/* Persistent Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === "guide") {
            setIsGuideModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onNewDoc={handleStartNewDoc}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === "home" && (
          <HomeHero
            onStartNew={handleStartNewDoc}
            onOpenChecker={() => setCurrentTab("checker")}
            onViewTemplates={() => {
              setTemplateFilter("all");
              setCurrentTab("templates");
            }}
            onSelectCategory={handleSelectHomeCategory}
            onStartAutoIdea={handleStartAutoIdea}
          />
        )}

        {currentTab === "wizard" && (
          <DocWizard
            initialDraft={wizardDraft}
            onComplete={handleWizardComplete}
            onCancel={() => setCurrentTab("home")}
          />
        )}

        {currentTab === "editor" && activeDocument && (
          <DocEditor
            document={activeDocument}
            onUpdateDocument={handleUpdateDocument}
            onOpenAuditModal={() => setIsAuditModalOpen(true)}
            onBack={() => setCurrentTab("home")}
          />
        )}

        {currentTab === "checker" && (
          <DocxUploadChecker
            onOpenDocumentInEditor={handleOpenDocInEditor}
            onCancel={() => setCurrentTab("home")}
          />
        )}

        {currentTab === "templates" && (
          <TemplatesGallery
            onUseTemplate={handleUseTemplate}
            selectedCategoryFilter={templateFilter}
          />
        )}

        {currentTab === "history" && (
          <HistoryView
            documents={documentsHistory}
            onOpenDoc={handleOpenDocInEditor}
            onDeleteDoc={handleDeleteHistoryDoc}
            onClearAll={handleClearAllHistory}
            onNewDoc={handleStartNewDoc}
          />
        )}
      </main>

      {/* Audit Modal */}
      {activeDocument && (
        <DocAuditModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          document={activeDocument}
          onUpdateDocument={handleUpdateDocument}
        />
      )}

      {/* User Guide Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* About & Copyright Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* Persistent Quick Action Toolbar */}
      <FixedToolbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === "guide") {
            setIsGuideModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onNewDoc={handleStartNewDoc}
        onOpenAbout={() => setIsAboutModalOpen(true)}
      />

      {/* Persistent Footer with Mandatory Copyright and Zalo Contact */}
      <Footer />
    </div>
  );
}

