import React, { useState, useEffect, useId } from "react";
import {
  WizardDraft,
  DocumentData,
  DocCategory,
  OrgType,
  SignType,
  DetailLevel,
  DocStyle,
  AudienceType,
} from "../types";
import { TEMPLATES_DATABASE } from "../data/templates";
import { IDEA_PRESETS, IdeaPreset } from "../data/ideaPresets";
import { auditAdministrativeDocument } from "../utils/ruleChecker";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Building2,
  FileText,
  HelpCircle,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Search,
  School,
  FileCheck,
  Shuffle,
  Lightbulb,
  Zap,
  Rocket,
  Check,
  Tag,
} from "lucide-react";

interface DocWizardProps {
  initialDraft?: Partial<WizardDraft>;
  onComplete: (doc: DocumentData) => void;
  onCancel: () => void;
}

const CATEGORY_TABS: { id: DocCategory | "all"; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "management", label: "Văn bản quản lý" },
  { id: "report", label: "Báo cáo" },
  { id: "school", label: "Trường học" },
  { id: "preschool", label: "Mầm non" },
  { id: "other", label: "Hành chính khác" },
];

const ALL_DOC_TYPES: { type: string; category: DocCategory; desc: string }[] = [
  { type: "Kế hoạch", category: "management", desc: "Xác định mục tiêu, tiến độ, biện pháp triển khai" },
  { type: "Quyết định", category: "management", desc: "Ban hành chủ trương, thành lập ban, khen thưởng" },
  { type: "Quy chế", category: "management", desc: "Quy chế làm việc, chi tiêu nội bộ, văn hóa công sở" },
  { type: "Quy định", category: "management", desc: "Quy định chuyên môn, bảo quản tài sản, nền nếp" },
  { type: "Chương trình", category: "management", desc: "Chương trình hành động, công tác trọng tâm" },
  { type: "Hướng dẫn", category: "management", desc: "Hướng dẫn chuyên môn, đánh giá học sinh" },
  { type: "Thông báo", category: "management", desc: "Thông báo tuyển sinh, lịch công tác, thu nộp" },
  { type: "Công văn", category: "management", desc: "Gửi công văn trao đổi, phối hợp, đôn đốc" },

  { type: "Báo cáo", category: "report", desc: "Báo cáo định kỳ công tác chung của đơn vị" },
  { type: "Báo cáo sơ kết", category: "report", desc: "Đánh giá kết quả học kỳ I hoặc giai đoạn công tác" },
  { type: "Báo cáo tổng kết", category: "report", desc: "Tổng kết toàn diện năm học hoặc đợt thi đua" },
  { type: "Báo cáo chuyên đề", category: "report", desc: "Chuyên đề đổi mới phương pháp, kiểm tra nội bộ" },
  { type: "Báo cáo kết quả thực hiện", category: "report", desc: "Kết quả thực hiện chỉ thị, công văn cấp trên" },
  { type: "Báo cáo tự đánh giá", category: "report", desc: "Kiểm định chất lượng giáo dục trường học" },

  { type: "Kế hoạch năm học", category: "school", desc: "Kế hoạch tổng thể phát triển nhà trường" },
  { type: "Kế hoạch giáo dục", category: "school", desc: "Kế hoạch dạy học theo định hướng CT GDPT 2018" },
  { type: "Kế hoạch chuyên môn", category: "school", desc: "Kế hoạch của Phó hiệu trưởng và tổ chuyên môn" },
  { type: "Phân công nhiệm vụ", category: "school", desc: "Bảng phân công nhiệm vụ cán bộ, giáo viên" },
  { type: "Kế hoạch kiểm tra", category: "school", desc: "Kiểm tra nội bộ trường học và chuyên đề" },
  { type: "Kế hoạch hội thi", category: "school", desc: "Thi giáo viên dạy giỏi, học sinh giỏi cấp trường" },

  { type: "Kế hoạch STEAM mầm non", category: "preschool", desc: "Ứng dụng phương pháp STEAM cho trẻ mầm non" },
  { type: "Kế hoạch chủ đề mầm non", category: "preschool", desc: "Kế hoạch giáo dục tuần, tháng theo chủ đề" },
  { type: "Báo cáo nuôi dưỡng chăm sóc trẻ", category: "preschool", desc: "Vệ sinh an toàn thực phẩm và bán trú" },

  { type: "Tờ trình", category: "other", desc: "Đề xuất cấp trên phê duyệt chủ trương, kinh phí" },
  { type: "Biên bản", category: "other", desc: "Biên bản họp hội đồng sư phạm, liên tịch" },
  { type: "Giấy mời", category: "other", desc: "Thư mời họp phụ huynh, hội nghị viên chức" },
  { type: "Giấy giới thiệu", category: "other", desc: "Giới thiệu cán bộ, giáo viên đi công tác" },
  { type: "Phiếu chuyển", category: "other", desc: "Chuyển đơn thư, hồ sơ tới cơ quan có thẩm quyền" },
  { type: "Đề án", category: "other", desc: "Đề án xây dựng trường chuẩn, thư viện tiên tiến" },
  { type: "Phương án", category: "other", desc: "Phương án phòng chống dịch, an toàn trường học" },
];

const PROMPT_SUGGESTIONS = [
  "Lập kế hoạch tổ chức Hội nghị cán bộ, viên chức và người lao động năm học 2026 - 2027.",
  "Soạn quyết định kiện toàn Ban Chỉ đạo chuyển đổi số và ứng dụng công nghệ thông tin nhà trường.",
  "Xây dựng kế hoạch chuyên đề ứng dụng phương pháp giáo dục STEAM cho trẻ mẫu giáo 4-5 tuổi.",
  "Soạn báo cáo sơ kết công tác học kỳ I và phương hướng nhiệm vụ học kỳ II năm học 2026 - 2027.",
  "Soạn tờ trình gửi cấp có thẩm quyền xin phê duyệt dự toán cải tạo, sửa chữa phòng học chức năng.",
  "Soạn thông báo về việc tuyển sinh vào trường mầm non/tiểu học năm học mới.",
];

export const DocWizard: React.FC<DocWizardProps> = ({
  initialDraft,
  onComplete,
  onCancel,
}) => {
  const currentYear = new Date().getFullYear();
  const todayStr = `ngày ${new Date().getDate().toString().padStart(2, "0")} tháng ${(new Date().getMonth() + 1).toString().padStart(2, "0")} năm ${currentYear}`;

  const [step, setStep] = useState<number>(initialDraft?.initialStep || 1);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<DocCategory | "all">("all");
  const [searchDocType, setSearchDocType] = useState<string>("");

  const searchInputId = useId();
  const parentOrgInputId = useId();
  const orgNameInputId = useId();
  const orgTypeSelectId = useId();
  const addressInputId = useId();
  const adminUnitInputId = useId();
  const provinceInputId = useId();
  const docCodeInputId = useId();
  const docDateInputId = useId();
  const docLocationInputId = useId();
  const docSignerInputId = useId();
  const docSignerRoleInputId = useId();
  const docSignTypeSelectId = useId();
  const promptTextareaId = useId();
  const detailLevelSelectId = useId();
  const docStyleSelectId = useId();
  const audienceSelectId = useId();

  // Ideas repository state for Step 4
  const [selectedIdeaCategory, setSelectedIdeaCategory] = useState<DocCategory | "all">("all");
  const [searchIdea, setSearchIdea] = useState<string>("");
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>("idea-kh-namhoc");
  const [ideaNotification, setIdeaNotification] = useState<string | null>(null);

  // Wizard form state - defaults to "Rất chi tiết" as requested
  const [draft, setDraft] = useState<WizardDraft>({
    docType: initialDraft?.docType || "Kế hoạch",
    category: initialDraft?.category || "school",
    parentOrg: initialDraft?.parentOrg || "SỞ GIÁO DỤC VÀ ĐÀO TẠO",
    orgName: initialDraft?.orgName || "TRƯỜNG THCS NGUYỄN DU",
    orgType: initialDraft?.orgType || "Trường THCS",
    address: initialDraft?.address || "Số 12 Đường Hùng Vương",
    location: initialDraft?.location || "Hà Nội",
    province: initialDraft?.province || "Thành phố Hà Nội",
    adminUnit: initialDraft?.adminUnit || "Phường Điện Biên",
    code: initialDraft?.code || `Số: .../KH-THCSND`,
    date: initialDraft?.date || todayStr,
    signerName: initialDraft?.signerName || "Trần Văn An",
    signerRole: initialDraft?.signerRole || "Hiệu trưởng",
    signType: initialDraft?.signType || "Ký trực tiếp",
    prompt:
      initialDraft?.prompt ||
      "Xây dựng kế hoạch thực hiện nhiệm vụ năm học toàn diện với các mục tiêu: nâng cao chất lượng giáo dục mũi nhọn và đại trà, đẩy mạnh chuyển đổi số trong dạy học và quản lý, xây dựng trường học hạnh phúc, tăng cường giáo dục đạo đức lối sống và kỹ năng công dân số cho học sinh.",
    detailLevel: initialDraft?.detailLevel || "Rất chi tiết",
    style: initialDraft?.style || "Hành chính chuẩn",
    audience: initialDraft?.audience || "Nhà trường",
  });

  // Progress state for Step 6
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const PROGRESS_MESSAGES = [
    "1. Tự động phân tích và phát triển ý tưởng chuyên sâu...",
    "2. Xác định cấu trúc 5 - 7 phần lớn theo Nghị định 30/2020/NĐ-CP...",
    "3. Soạn thảo chi tiết các điều khoản, chỉ tiêu và giải pháp...",
    "4. Phân công trách nhiệm và dự toán kinh phí triển khai...",
    "5. Rà soát căn cứ pháp lý và đơn vị hành chính...",
    "6. Kiểm tra thể thức: Quốc hiệu, tiêu ngữ, số hiệu, chữ ký...",
    "7. Định dạng văn bản Microsoft Word chuẩn mực...",
    "8. Hoàn tất văn bản chi tiết chất lượng cao!",
  ];

  // Auto-suggest code when docType or orgName changes
  useEffect(() => {
    let typeCode = "KH";
    if (draft.docType.includes("Quyết định")) typeCode = "QĐ";
    else if (draft.docType.includes("Báo cáo")) typeCode = "BC";
    else if (draft.docType.includes("Thông báo")) typeCode = "TB";
    else if (draft.docType.includes("Tờ trình")) typeCode = "TTr";
    else if (draft.docType.includes("Biên bản")) typeCode = "BB";
    else if (draft.docType.includes("Công văn")) typeCode = "CV";
    else if (draft.docType.includes("Quy chế")) typeCode = "QC";

    const acronym = draft.orgName
      ? draft.orgName
          .split(" ")
          .filter((w) => w.length > 0)
          .map((w) => w[0].toUpperCase())
          .join("")
          .slice(0, 6)
      : "ĐV";

    setDraft((prev) => ({
      ...prev,
      code: `Số: .../${typeCode}-${acronym}`,
    }));
  }, [draft.docType, draft.orgName]);

  // Sign type logic warning
  const getSignTypeWarning = (signType: SignType, role: string) => {
    if (signType === "TM." && !role.toLowerCase().includes("thay mặt") && !role.toLowerCase().includes("hội đồng")) {
      return "Ký 'TM.' (Thay mặt): thường áp dụng khi ký thay mặt tập thể lãnh đạo (UBND, Ban Thường vụ, Hội đồng trường).";
    }
    if (signType === "KT." && (role.toLowerCase().includes("trưởng") && !role.toLowerCase().includes("phó"))) {
      return "Ký 'KT.' (Ký thay): chỉ dùng cho cấp phó ký thay người đứng đầu (ví dụ: KT. HIỆU TRƯỞNG - PHÓ HIỆU TRƯỞNG).";
    }
    if (signType === "TL." && !role.toLowerCase().includes("thừa lệnh") && !role.toLowerCase().includes("chánh") && !role.toLowerCase().includes("trưởng phòng")) {
      return "Ký 'TL.' (Thừa lệnh): người đứng đầu giao cho Chánh Văn phòng, Trưởng phòng chuyên môn ký thừa lệnh.";
    }
    return null;
  };

  const signWarning = getSignTypeWarning(draft.signType, draft.signerRole);

  // Filter doc types
  const filteredDocTypes = ALL_DOC_TYPES.filter((item) => {
    const matchCategory = selectedCategoryTab === "all" || item.category === selectedCategoryTab;
    const matchSearch =
      searchDocType.trim() === "" ||
      item.type.toLowerCase().includes(searchDocType.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchDocType.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Filter ideas in idea repository
  const filteredIdeas = IDEA_PRESETS.filter((idea) => {
    const matchCategory = selectedIdeaCategory === "all" || idea.category === selectedIdeaCategory;
    const matchSearch =
      searchIdea.trim() === "" ||
      idea.title.toLowerCase().includes(searchIdea.toLowerCase()) ||
      idea.shortDesc.toLowerCase().includes(searchIdea.toLowerCase()) ||
      idea.tags.some((t) => t.toLowerCase().includes(searchIdea.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // Action: Select idea preset
  const handleSelectIdea = (preset: IdeaPreset, autoStart: boolean = false) => {
    setActiveIdeaId(preset.id);
    setDraft((prev) => ({
      ...prev,
      docType: preset.docType,
      category: preset.category,
      prompt: preset.fullPrompt,
      detailLevel: "Rất chi tiết",
    }));
    setIdeaNotification(`Đã chọn ý tưởng: "${preset.title}"`);
    setTimeout(() => setIdeaNotification(null), 3500);

    if (autoStart) {
      handleGenerate(preset.fullPrompt, preset.docType, preset.category);
    }
  };

  // Action: Cycle random idea
  const handleCycleRandomIdea = () => {
    const randomIdx = Math.floor(Math.random() * IDEA_PRESETS.length);
    const preset = IDEA_PRESETS[randomIdx];
    handleSelectIdea(preset, false);
  };

  // Action: Auto-synthesize idea based on docType and orgName
  const handleAutoSynthesizeIdea = () => {
    const tailoredPrompt = `Xây dựng kế hoạch công tác toàn diện, tổ chức triển khai các nhiệm vụ trọng tâm của ${draft.orgName} với mục tiêu đổi mới phương pháp, nâng cao chất lượng thực thi công vụ, đẩy mạnh ứng dụng công nghệ thông tin và chuyển đổi số, phân công rõ người rõ việc và bảo đảm tiến độ chất lượng.`;
    setDraft((prev) => ({
      ...prev,
      prompt: tailoredPrompt,
      detailLevel: "Rất chi tiết",
    }));
    setActiveIdeaId(null);
    setIdeaNotification("AI đã tự động tạo ý tưởng chuyên sâu phù hợp với loại văn bản và đơn vị của bạn!");
    setTimeout(() => setIdeaNotification(null), 3500);
  };

  // Action: Fast 1-Click Auto Compose from Step 1
  const handleFastAutoCompose = (docType: string, category: DocCategory) => {
    const matchingPreset =
      IDEA_PRESETS.find((p) => p.docType.toLowerCase() === docType.toLowerCase()) ||
      IDEA_PRESETS.find((p) => p.category === category) ||
      IDEA_PRESETS[0];

    handleSelectIdea(matchingPreset, true);
  };

  // Handle generation trigger
  const handleGenerate = async (
    overridePrompt?: string,
    overrideDocType?: string,
    overrideCategory?: DocCategory
  ) => {
    setStep(6);
    setIsGenerating(true);
    setProgressStep(0);
    setGenerationError(null);

    const targetDocType = overrideDocType || draft.docType;
    const targetCategory = overrideCategory || draft.category;
    const targetPrompt =
      (overridePrompt || draft.prompt || "").trim() ||
      `Xây dựng kế hoạch công tác toàn diện, thực hiện các nhiệm vụ trọng tâm của ${draft.orgName} nhằm nâng cao chất lượng quản lý, chuyên môn giáo dục, chuyển đổi số và phát triển bền vững.`;

    // Simulate 8 progress steps with visual reassurance
    for (let i = 1; i <= 7; i++) {
      await new Promise((r) => setTimeout(r, 450));
      setProgressStep(i);
    }

    try {
      // Call Server AI Endpoint
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType: targetDocType,
          orgInfo: {
            parentOrg: draft.parentOrg,
            orgName: draft.orgName,
            orgType: draft.orgType,
            address: draft.address,
            location: draft.location,
            province: draft.province,
            adminUnit: draft.adminUnit,
          },
          docMeta: {
            code: draft.code,
            date: draft.date,
            signer: draft.signerName,
            signerRole: draft.signerRole,
            signType: draft.signType,
            location: draft.location,
          },
          prompt: targetPrompt,
          config: {
            detailLevel: "Rất chi tiết",
            style: draft.style,
            audience: draft.audience,
          },
        }),
      });

      const resData = await response.json();
      setProgressStep(8);

      let docData: DocumentData;

      if (resData.success && resData.data) {
        const aiData = resData.data;
        docData = {
          id: `doc-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          docType: targetDocType,
          category: targetCategory,
          parentOrg: aiData.parentOrg || draft.parentOrg,
          orgName: aiData.orgName || draft.orgName,
          orgType: draft.orgType,
          address: draft.address,
          location: draft.location,
          province: draft.province,
          adminUnit: draft.adminUnit,
          code: aiData.code || draft.code,
          date: draft.date,
          title: (aiData.title || targetDocType).toUpperCase(),
          documentSubject: aiData.documentSubject || targetPrompt.slice(0, 100),
          legalBases: aiData.legalBases || [
            "Luật Giáo dục ngày 14 tháng 6 năm 2019;",
            "Nghị định số 30/2020/NĐ-CP ngày 05/3/2020 của Chính phủ về công tác văn thư;",
          ],
          contentSections: aiData.contentSections || [],
          recipients: aiData.recipients || ["Như trên;", "Ban Giám hiệu;", "Lưu: VT, hồ sơ."],
          signerTitle: (aiData.signerTitle || draft.signerRole).toUpperCase(),
          signerSignType: draft.signType,
          signerName: aiData.signerName || draft.signerName,
          notes: resData.notice || aiData.aiNotes,
        };
      } else {
        // Fallback to pre-built high-quality template matching docType
        const matchedTpl =
          TEMPLATES_DATABASE.find((t) => t.docType === targetDocType) ||
          TEMPLATES_DATABASE[0];

        docData = {
          id: `doc-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          docType: targetDocType,
          category: targetCategory,
          parentOrg: draft.parentOrg,
          orgName: draft.orgName,
          orgType: draft.orgType,
          address: draft.address,
          location: draft.location,
          province: draft.province,
          adminUnit: draft.adminUnit,
          code: draft.code,
          date: draft.date,
          title: (matchedTpl.defaultData.title || targetDocType).toUpperCase(),
          documentSubject:
            matchedTpl.defaultData.documentSubject || targetPrompt.slice(0, 90),
          legalBases: matchedTpl.defaultData.legalBases || [
            "Nghị định số 30/2020/NĐ-CP ngày 05/3/2020 của Chính phủ về công tác văn thư;",
          ],
          contentSections: matchedTpl.defaultData.contentSections || [],
          recipients: matchedTpl.defaultData.recipients || ["Như trên;", "Lưu: VT."],
          signerTitle: (draft.signerRole || "HIỆU TRƯỞNG").toUpperCase(),
          signerSignType: draft.signType,
          signerName: draft.signerName,
          notes: "Được khởi tạo theo mẫu quy chuẩn Nghị định 30/2020/NĐ-CP với độ dài và chi tiết cao.",
        };
      }

      // Run automatic audit before completing
      docData.auditResult = auditAdministrativeDocument(docData);

      setTimeout(() => {
        setIsGenerating(false);
        onComplete(docData);
      }, 700);
    } catch (err: any) {
      console.error("AI Generation Error", err);
      setGenerationError("Máy chủ phản hồi chậm, tự động hoàn tất bằng bộ mẫu chuẩn...");
      setTimeout(() => {
        setIsGenerating(false);
        const fallbackDoc: DocumentData = {
          id: `doc-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          docType: targetDocType,
          category: targetCategory,
          parentOrg: draft.parentOrg,
          orgName: draft.orgName,
          orgType: draft.orgType,
          address: draft.address,
          location: draft.location,
          province: draft.province,
          adminUnit: draft.adminUnit,
          code: draft.code,
          date: draft.date,
          title: targetDocType.toUpperCase(),
          documentSubject: targetPrompt.slice(0, 100),
          legalBases: [
            "Luật Giáo dục ngày 14 tháng 6 năm 2019;",
            "Nghị định số 30/2020/NĐ-CP ngày 05/3/2020 của Chính phủ về công tác văn thư;",
          ],
          contentSections: [
            {
              heading: "I. MỤC ĐÍCH, YÊU CẦU",
              items: [
                "1. Nhằm cụ thể hóa kế hoạch công tác của đơn vị trong năm học.",
                "2. Nâng cao tinh thần trách nhiệm của từng cá nhân, tổ chuyên môn.",
              ],
            },
            {
              heading: "II. NỘI DUNG VÀ NHIỆM VỤ TRỌNG TÂM",
              items: [
                "1. Triển khai các nhiệm vụ theo đúng yêu cầu đề ra.",
                "2. Định kỳ báo cáo tiến độ và kết quả thực hiện cho Ban Giám hiệu.",
              ],
            },
            {
              heading: "III. TỔ CHỨC THỰC HIỆN",
              items: [
                "1. Ban Giám hiệu chịu trách nhiệm kiểm tra, giám sát thường xuyên.",
                "2. Các bộ phận, tổ chuyên môn nghiêm túc triển khai thực hiện.",
              ],
            },
          ],
          recipients: ["Như trên;", "Ban Giám hiệu (chỉ đạo);", "Lưu: VT, hồ sơ."],
          signerTitle: (draft.signerRole || "HIỆU TRƯỞNG").toUpperCase(),
          signerSignType: draft.signType,
          signerName: draft.signerName,
        };
        fallbackDoc.auditResult = auditAdministrativeDocument(fallbackDoc);
        onComplete(fallbackDoc);
      }, 1000);
    }
  };

  // Auto-run if initialDraft requests direct generation (1-Click Auto Idea)
  useEffect(() => {
    if (initialDraft?.autoStart) {
      handleGenerate(initialDraft.prompt, initialDraft.docType, initialDraft.category);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Step Indicator Header */}
      <div className="mb-8 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onCancel}
            className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Hủy bỏ & quay về trang chủ</span>
          </button>
          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
            Bước {step} / 6
          </span>
        </div>

        {/* Step dots */}
        <div className="grid grid-cols-6 gap-2 text-center text-xs">
          {[
            { s: 1, label: "Loại văn bản" },
            { s: 2, label: "Cơ quan" },
            { s: 3, label: "Thông tin ký" },
            { s: 4, label: "Yêu cầu" },
            { s: 5, label: "Cấu hình" },
            { s: 6, label: "Tạo văn bản" },
          ].map((item) => (
            <div
              key={item.s}
              onClick={() => !isGenerating && item.s <= step && setStep(item.s)}
              className={`cursor-pointer transition-all ${
                step === item.s
                  ? "text-sky-700 font-bold"
                  : step > item.s
                  ? "text-slate-700 font-semibold"
                  : "text-slate-400 font-normal"
              }`}
            >
              <div
                className={`h-2 rounded-full mb-1.5 transition-all ${
                  step === item.s
                    ? "bg-sky-600"
                    : step > item.s
                    ? "bg-emerald-500"
                    : "bg-slate-200"
                }`}
              />
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: CHỌN LOẠI VĂN BẢN */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <FileText className="w-6 h-6 text-sky-600" />
              <span>Bước 1: Chọn loại văn bản cần soạn</span>
            </h2>
            <p className="text-xs text-slate-500">
              Chọn thể loại văn bản phù hợp. Bạn có thể chọn loại văn bản rồi nhấn <strong>"Soạn tự động"</strong> để AI viết ngay văn bản dài và chi tiết nhất mà không cần nhập nội dung!
            </p>
          </div>

          {/* 1-Click Auto-Compose Highlight Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Zap className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  ⚡ Tự động soạn {draft.docType} theo ý tưởng (1-Click)
                </h3>
                <p className="text-xs text-slate-600">
                  Không cần nhập nội dung! AI sẽ tự động kích hoạt ý tưởng tối ưu, thiết lập cấu trúc 5 - 7 phần lớn chi tiết nhất.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleFastAutoCompose(draft.docType, draft.category)}
              className="w-full sm:w-auto shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white text-xs font-black shadow-md shadow-sky-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95"
            >
              <Rocket className="w-4 h-4 text-amber-300" />
              <span>Soạn tự động {draft.docType} ngay</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <label htmlFor={searchInputId} className="sr-only">
              Tìm kiếm loại văn bản
            </label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id={searchInputId}
              type="text"
              placeholder="Tìm loại văn bản (Kế hoạch, Quyết định, Báo cáo, STEAM, Tờ trình...)"
              value={searchDocType}
              onChange={(e) => setSearchDocType(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategoryTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategoryTab === tab.id
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Doc Type Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
            {filteredDocTypes.map((item) => {
              const isSelected = draft.docType === item.type;
              return (
                <div
                  key={item.type}
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      docType: item.type,
                      category: item.category,
                    }))
                  }
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-sky-600 bg-sky-50/70 shadow-xs ring-2 ring-sky-500/20"
                      : "border-slate-200 hover:border-sky-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{item.type}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">Chuẩn NĐ 30</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFastAutoCompose(item.type, item.category);
                      }}
                      className="px-2 py-0.5 rounded-md bg-sky-100 hover:bg-sky-200 text-sky-800 text-[11px] font-bold flex items-center space-x-1 transition-colors"
                      title="Soạn tự động hoàn chỉnh không cần nhập nội dung"
                    >
                      <Sparkles className="w-3 h-3 text-sky-600" />
                      <span>⚡ Soạn tự động</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Button */}
          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => handleFastAutoCompose(draft.docType, draft.category)}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center space-x-1.5 py-2 px-3 rounded-lg hover:bg-sky-50 transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Bỏ qua các bước khác & Soạn tự động ngay</span>
            </button>
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 flex items-center space-x-2 active:scale-95 transition-all"
            >
              <span>Tiếp tục: Thông tin cơ quan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: THÔNG TIN CƠ QUAN */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <Building2 className="w-6 h-6 text-sky-600" />
              <span>Bước 2: Thông tin cơ quan, đơn vị ban hành</span>
            </h2>
            <p className="text-xs text-slate-500">
              Nhập chính xác tên đơn vị ban hành và cơ quan chủ quản để định dạng bảng Header đúng quy định.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Parent Org */}
            <div className="space-y-1.5">
              <label htmlFor={parentOrgInputId} className="text-xs font-bold text-slate-700">Tên cơ quan chủ quản</label>
              <input
                id={parentOrgInputId}
                type="text"
                value={draft.parentOrg}
                onChange={(e) => setDraft({ ...draft, parentOrg: e.target.value })}
                placeholder="VD: SỞ GIÁO DỤC VÀ ĐÀO TẠO, UBND TỈNH..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden"
              />
              <p className="text-[11px] text-slate-400">Để trống nếu là cơ quan độc lập không trực thuộc.</p>
            </div>

            {/* Issuing Org */}
            <div className="space-y-1.5">
              <label htmlFor={orgNameInputId} className="text-xs font-bold text-slate-700">
                Tên đơn vị ban hành <span className="text-rose-500">*</span>
              </label>
              <input
                id={orgNameInputId}
                type="text"
                value={draft.orgName}
                onChange={(e) => setDraft({ ...draft, orgName: e.target.value })}
                placeholder="VD: TRƯỜNG THCS NGUYỄN DU, TRƯỜNG MẦM NON HOA SEN..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm font-semibold outline-hidden"
              />
            </div>

            {/* Org Type */}
            <div className="space-y-1.5">
              <label htmlFor={orgTypeSelectId} className="text-xs font-bold text-slate-700">Loại hình đơn vị</label>
              <select
                id={orgTypeSelectId}
                value={draft.orgType}
                onChange={(e) => setDraft({ ...draft, orgType: e.target.value as OrgType })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden bg-white"
              >
                <option value="Trường Mầm non">Trường Mầm non</option>
                <option value="Trường Tiểu học">Trường Tiểu học</option>
                <option value="Trường THCS">Trường THCS</option>
                <option value="Trường THPT">Trường THPT</option>
                <option value="Trường học">Trường học liên cấp</option>
                <option value="Cơ sở giáo dục khác">Cơ sở giáo dục khác</option>
                <option value="Cơ quan nhà nước">Cơ quan nhà nước</option>
                <option value="UBND">UBND</option>
                <option value="Tổ chức khác">Tổ chức khác</option>
              </select>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label htmlFor={addressInputId} className="text-xs font-bold text-slate-700">Địa chỉ trụ sở</label>
              <input
                id={addressInputId}
                type="text"
                value={draft.address}
                onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                placeholder="VD: Số 45 Đường Giải Phóng"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden"
              />
            </div>

            {/* Admin Unit */}
            <div className="space-y-1.5">
              <label htmlFor={adminUnitInputId} className="text-xs font-bold text-slate-700">
                Đơn vị hành chính hiện hành
              </label>
              <input
                id={adminUnitInputId}
                type="text"
                value={draft.adminUnit}
                onChange={(e) => setDraft({ ...draft, adminUnit: e.target.value })}
                placeholder="VD: Phường Tràng Tiền, Xã Hòa Bình..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden"
              />
            </div>

            {/* Province / City */}
            <div className="space-y-1.5">
              <label htmlFor={provinceInputId} className="text-xs font-bold text-slate-700">Tỉnh / Thành phố</label>
              <input
                id={provinceInputId}
                type="text"
                value={draft.province}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    province: e.target.value,
                    location: e.target.value.replace(/^(Tỉnh|Thành phố)\s+/i, ""),
                  })
                }
                placeholder="VD: Thành phố Hà Nội, Tỉnh Quảng Ninh..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Quay lại
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 flex items-center space-x-2 active:scale-95 transition-all"
            >
              <span>Tiếp tục: Thông tin văn bản & Ký</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: THÔNG TIN VĂN BẢN & NGƯỜI KÝ */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <FileCheck className="w-6 h-6 text-sky-600" />
              <span>Bước 3: Thông tin văn bản, thẩm quyền & người ký</span>
            </h2>
            <p className="text-xs text-slate-500">
              Kiểm tra số hiệu văn bản, địa danh, ngày ban hành và chức danh thẩm quyền ký.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Doc Code */}
            <div className="space-y-1.5">
              <label htmlFor={docCodeInputId} className="text-xs font-bold text-slate-700">Số và ký hiệu</label>
              <input
                id={docCodeInputId}
                type="text"
                value={draft.code}
                onChange={(e) => setDraft({ ...draft, code: e.target.value })}
                placeholder="VD: Số: 12/KH-THCSND"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden"
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label htmlFor={docDateInputId} className="text-xs font-bold text-slate-700">Ngày tháng ban hành</label>
              <input
                id={docDateInputId}
                type="text"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                placeholder="ngày ... tháng ... năm 202..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden"
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label htmlFor={docLocationInputId} className="text-xs font-bold text-slate-700">Địa danh</label>
              <input
                id={docLocationInputId}
                type="text"
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                placeholder="VD: Hà Nội, Đà Nẵng, Hải Phòng..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden"
              />
            </div>

            {/* Signer Name */}
            <div className="space-y-1.5">
              <label htmlFor={docSignerInputId} className="text-xs font-bold text-slate-700">Họ và tên người ký</label>
              <input
                id={docSignerInputId}
                type="text"
                value={draft.signerName}
                onChange={(e) => setDraft({ ...draft, signerName: e.target.value })}
                placeholder="VD: Nguyễn Văn A"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden"
              />
            </div>

            {/* Signer Role */}
            <div className="space-y-1.5">
              <label htmlFor={docSignerRoleInputId} className="text-xs font-bold text-slate-700">Chức vụ người ký</label>
              <input
                id={docSignerRoleInputId}
                type="text"
                value={draft.signerRole}
                onChange={(e) => setDraft({ ...draft, signerRole: e.target.value })}
                placeholder="VD: Hiệu trưởng, Giám đốc, Chủ tịch..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden"
              />
            </div>

            {/* Sign Type */}
            <div className="space-y-1.5">
              <label htmlFor={docSignTypeSelectId} className="text-xs font-bold text-slate-700">Loại ký (Thẩm quyền ký)</label>
              <select
                id={docSignTypeSelectId}
                value={draft.signType}
                onChange={(e) => setDraft({ ...draft, signType: e.target.value as SignType })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden bg-white"
              >
                <option value="Ký trực tiếp">Ký trực tiếp (Thủ trưởng đơn vị)</option>
                <option value="KT.">KT. (Ký thay người đứng đầu - Dành cho cấp Phó)</option>
                <option value="TM.">TM. (Thay mặt tập thể lãnh đạo / Hội đồng)</option>
                <option value="TL.">TL. (Thừa lệnh - Chánh Văn phòng / Trưởng phòng)</option>
                <option value="TUQ.">TUQ. (Thừa ủy quyền)</option>
                <option value="Q.">Q. (Quyền - Quyền Hiệu trưởng / Giám đốc)</option>
              </select>
            </div>
          </div>

          {/* AI Logic Sign Warning */}
          {signWarning && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-2 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold">Lưu ý logic thẩm quyền ký: </span>
                {signWarning}
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Quay lại
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 flex items-center space-x-2 active:scale-95 transition-all"
            >
              <span>Tiếp tục: Nhập yêu cầu nội dung</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: KHO Ý TƯỞNG & TỰ ĐỘNG SOẠN (KHÔNG CẦN NHẬP NỘI DUNG) */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chế độ tự động hoàn toàn: Không cần bạn gõ nội dung</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <Lightbulb className="w-6 h-6 text-amber-500" />
              <span>Bước 4: Chọn ý tưởng soạn thảo hoặc để AI tự động đảm nhiệm</span>
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bạn <strong>không cần tự gõ bất kỳ nội dung nào</strong>. Hãy chọn một ý tưởng có sẵn trong kho bên dưới, hoặc bấm <strong>"Đổi ý tưởng ngẫu nhiên"</strong>, hoặc để trống để AI tự động sáng tạo văn bản dài và chi tiết nhất!
            </p>
          </div>

          {/* Quick Action Tools Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCycleRandomIdea}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-600" />
              <span>🎲 Đổi ý tưởng ngẫu nhiên</span>
            </button>

            <button
              type="button"
              onClick={handleAutoSynthesizeIdea}
              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>✨ Sinh ý tưởng theo {draft.docType}</span>
            </button>

            <button
              type="button"
              onClick={() => handleGenerate()}
              className="ml-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Soạn ngay với ý tưởng này (Chi tiết tối đa)</span>
            </button>
          </div>

          {/* Toast Notification when idea changes */}
          {ideaNotification && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{ideaNotification}</span>
            </div>
          )}

          {/* Prompt Preview / Edit Box (Optional) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={promptTextareaId} className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                <span>Ý tưởng đang chọn để soạn thảo:</span>
                <span className="text-[11px] font-normal text-slate-400">(Có thể để trống hoặc chỉnh sửa thêm nếu muốn)</span>
              </label>
              {draft.prompt.trim() && (
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, prompt: "" })}
                  className="text-[11px] text-slate-400 hover:text-rose-500 font-medium"
                >
                  Xóa trắng để AI tự sáng tạo
                </button>
              )}
            </div>

            <textarea
              id={promptTextareaId}
              rows={4}
              value={draft.prompt}
              onChange={(e) => setDraft({ ...draft, prompt: e.target.value })}
              placeholder="(Để trống nếu bạn muốn AI tự động sáng tạo toàn bộ văn bản dài và chi tiết nhất theo Nghị định 30, hoặc chỉnh sửa ý tưởng đã chọn ở danh sách bên dưới...)"
              className="w-full p-4 rounded-2xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden leading-relaxed resize-none bg-slate-50/50"
            />
          </div>

          {/* CURATED IDEA PRESETS REPOSITORY */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-sky-600" />
                <span>Kho ý tưởng chuyên sâu theo chủ đề ({IDEA_PRESETS.length} ý tưởng)</span>
              </span>
              <span className="text-[11px] text-slate-500">Nhấn để chọn ý tưởng tức thì</span>
            </div>

            {/* Category Filter for Ideas */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedIdeaCategory(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedIdeaCategory === tab.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Ideas Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {filteredIdeas.map((preset) => {
                const isActive = activeIdeaId === preset.id || draft.prompt === preset.fullPrompt;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectIdea(preset, false)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isActive
                        ? "border-sky-600 bg-sky-50/80 shadow-xs ring-2 ring-sky-500/20"
                        : "border-slate-200 hover:border-sky-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-slate-900 leading-snug">
                          {preset.title}
                        </span>
                        {isActive ? (
                          <span className="shrink-0 px-2 py-0.5 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center space-x-0.5">
                            <Check className="w-3 h-3" />
                            <span>Đang chọn</span>
                          </span>
                        ) : (
                          <span className="shrink-0 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {preset.docType}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {preset.shortDesc}
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {preset.tags.slice(0, 2).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectIdea(preset, true);
                        }}
                        className="text-[10px] font-black text-sky-700 hover:text-sky-900 bg-white hover:bg-sky-100 px-2 py-1 rounded-md border border-sky-200 transition-colors flex items-center space-x-1"
                      >
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>Soạn ngay</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="pt-4 flex justify-between items-center">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Quay lại
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Tạo ngay (Chi tiết tối đa)</span>
              </button>

              <button
                onClick={() => setStep(5)}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 flex items-center space-x-2 active:scale-95 transition-all"
              >
                <span>Tiếp tục: Cấu hình văn bản</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: CẤU HÌNH VĂN BẢN */}
      {step === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <Sliders className="w-6 h-6 text-sky-600" />
              <span>Bước 5: Cấu hình phong cách & độ chi tiết</span>
            </h2>
            <p className="text-xs text-slate-500">
              Hệ thống đã tự động kích hoạt mức độ <strong>"Rất chi tiết"</strong> để đảm bảo văn bản được soạn thảo dài và đầy đủ nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Detail Level */}
            <div className="space-y-2">
              <label htmlFor={detailLevelSelectId} className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <span>Mức độ chi tiết</span>
                <span className="text-emerald-600 font-bold">(Khuyên dùng)</span>
              </label>
              <select
                id={detailLevelSelectId}
                value={draft.detailLevel}
                onChange={(e) => setDraft({ ...draft, detailLevel: e.target.value as DetailLevel })}
                className="w-full px-3.5 py-2 rounded-xl border border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden bg-sky-50/40 font-semibold text-sky-900"
              >
                <option value="Rất chi tiết">Rất chi tiết (Tối đa dung lượng, 5 - 7 mục lớn, chi tiết nhất)</option>
                <option value="Chi tiết">Chi tiết (Kèm biện pháp & phân công)</option>
                <option value="Tiêu chuẩn">Tiêu chuẩn (Đầy đủ mục theo NĐ 30)</option>
                <option value="Ngắn gọn">Ngắn gọn (Trực tiếp, súc tích)</option>
              </select>
            </div>

            {/* Style */}
            <div className="space-y-2">
              <label htmlFor={docStyleSelectId} className="text-xs font-bold text-slate-700">Phong cách trình bày</label>
              <select
                id={docStyleSelectId}
                value={draft.style}
                onChange={(e) => setDraft({ ...draft, style: e.target.value as DocStyle })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden bg-white"
              >
                <option value="Hành chính chuẩn">Hành chính chuẩn (Nghị định 30)</option>
                <option value="Trang trọng">Trang trọng (Nghiêm cẩn, cấp cao)</option>
                <option value="Chuyên nghiệp">Chuyên nghiệp (Sư phạm, rõ ràng)</option>
                <option value="Ngắn gọn">Ngắn gọn (Công vụ nhanh)</option>
              </select>
            </div>

            {/* Audience */}
            <div className="space-y-2">
              <label htmlFor={audienceSelectId} className="text-xs font-bold text-slate-700">Đối tượng tiếp nhận</label>
              <select
                id={audienceSelectId}
                value={draft.audience}
                onChange={(e) => setDraft({ ...draft, audience: e.target.value as AudienceType })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-hidden bg-white"
              >
                <option value="Nhà trường">Toàn thể nhà trường</option>
                <option value="Giáo viên">Cán bộ, giáo viên, nhân viên</option>
                <option value="Phụ huynh">Phụ huynh học sinh</option>
                <option value="Cơ quan nhà nước">Cơ quan quản lý cấp trên</option>
                <option value="Cán bộ quản lý">Ban Giám hiệu & Tổ trưởng</option>
                <option value="Đơn vị phối hợp">Đơn vị ban ngành phối hợp</option>
                <option value="Khác">Đối tượng khác</option>
              </select>
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2 text-xs">
            <span className="font-bold text-sky-900 block">Tóm tắt thiết lập văn bản:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
              <div>Loại: <strong className="text-slate-900">{draft.docType}</strong></div>
              <div>Đơn vị: <strong className="text-slate-900">{draft.orgName}</strong></div>
              <div>Người ký: <strong className="text-slate-900">{draft.signerName} ({draft.signerRole})</strong></div>
              <div>Chi tiết: <strong className="text-emerald-700">{draft.detailLevel}</strong></div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(4)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Quay lại kho ý tưởng
            </button>
            <button
              onClick={() => setStep(6)}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 flex items-center space-x-2 active:scale-95 transition-all"
            >
              <span>Sẵn sàng: Tạo văn bản</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: TIẾN TRÌNH & NÚT TẠO VĂN BẢN */}
      {step === 6 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg text-center space-y-8">
          <div className="space-y-2 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-sky-500/30">
              <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tạo văn bản hoàn chỉnh bằng PHÚC AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Hệ thống sẽ thực hiện quy trình tự động 8 bước: phân tích, soạn thảo, kiểm tra thể thức và chuẩn hóa định dạng Microsoft Word.
            </p>
          </div>

          {/* Generation Progress Indicator */}
          {isGenerating ? (
            <div className="max-w-md mx-auto space-y-4 p-6 rounded-2xl bg-sky-50 border border-sky-100 text-left">
              <div className="flex items-center justify-between text-xs font-bold text-sky-900">
                <span>Tiến trình xử lý AI</span>
                <span>{Math.round((progressStep / 8) * 100)}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 rounded-full bg-sky-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-600 to-blue-600 transition-all duration-300"
                  style={{ width: `${(progressStep / 8) * 100}%` }}
                />
              </div>

              <div className="space-y-2 pt-2">
                {PROGRESS_MESSAGES.map((msg, index) => {
                  const isDone = progressStep > index;
                  const isCurrent = progressStep === index;
                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 text-xs transition-opacity ${
                        isDone
                          ? "text-emerald-700 font-semibold"
                          : isCurrent
                          ? "text-sky-700 font-bold"
                          : "text-slate-400 opacity-60"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : isCurrent ? (
                        <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-spin shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span>{msg}</span>
                    </div>
                  );
                })}
              </div>

              {generationError && (
                <p className="text-xs text-amber-700 bg-amber-100 p-2 rounded-lg font-medium">
                  {generationError}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <button
                id="btn-trigger-ai-create"
                onClick={handleGenerate}
                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:to-blue-700 text-white font-black text-lg shadow-xl shadow-sky-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-3 mx-auto cursor-pointer"
              >
                <Sparkles className="w-6 h-6 text-amber-300" />
                <span>✨ TẠO VĂN BẢN NGAY</span>
              </button>

              <p className="text-xs text-slate-400">
                Nhấn để bắt đầu. Thời gian xử lý khoảng 3 - 6 giây.
              </p>
            </div>
          )}

          <div className="pt-4 flex justify-start">
            <button
              onClick={() => setStep(5)}
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Quay lại bước 5
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
