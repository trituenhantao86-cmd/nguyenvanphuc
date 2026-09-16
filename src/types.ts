export type DocCategory = "management" | "report" | "other" | "school" | "preschool";

export type OrgType =
  | "Cơ quan nhà nước"
  | "UBND"
  | "Trường học"
  | "Trường Mầm non"
  | "Trường Tiểu học"
  | "Trường THCS"
  | "Trường THPT"
  | "Cơ sở giáo dục khác"
  | "Tổ chức khác";

export type SignType = "Ký trực tiếp" | "TM." | "KT." | "Q." | "TL." | "TUQ.";

export type DetailLevel = "Ngắn gọn" | "Tiêu chuẩn" | "Chi tiết" | "Rất chi tiết";

export type DocStyle = "Hành chính chuẩn" | "Trang trọng" | "Ngắn gọn" | "Chuyên nghiệp";

export type AudienceType =
  | "Cơ quan nhà nước"
  | "Nhà trường"
  | "Giáo viên"
  | "Phụ huynh"
  | "Cán bộ quản lý"
  | "Đơn vị phối hợp"
  | "Khác";

export interface ContentSection {
  heading: string;
  items: string[];
}

export interface CheckItem {
  id: string;
  name: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

export interface AuditResult {
  totalScore: number;
  scores: {
    formatScore: number;
    contentScore: number;
    structureScore: number;
    adminUnitScore: number;
    typographyScore: number;
  };
  adminUnitStatus: "appropriate" | "needs_review";
  adminUnitMessage: string;
  checks: CheckItem[];
  suggestions: string[];
  detectedIssuesCount: number;
  hasOutdatedDistrict: boolean;
  outdatedDistrictWarnings: string[];
  isReadyToExport: boolean;
}

export interface DocumentData {
  id: string;
  createdAt: string;
  updatedAt: string;
  docType: string;
  category: DocCategory;
  parentOrg: string;
  orgName: string;
  orgType: OrgType;
  address: string;
  location: string;
  province: string;
  adminUnit: string;
  code: string;
  date: string;
  title: string;
  documentSubject: string;
  legalBases: string[];
  contentSections: ContentSection[];
  recipients: string[];
  signerTitle: string;
  signerSignType: SignType;
  signerName: string;
  notes?: string;
  auditResult?: AuditResult;
}

export interface DocTemplate {
  id: string;
  name: string;
  category: DocCategory;
  docType: string;
  description: string;
  targetAudience: string;
  structure: string[];
  samplePrompt: string;
  defaultData: Partial<DocumentData>;
  formattingRules: string[];
  legalNotes: string;
}

export interface WizardDraft {
  docType: string;
  category: DocCategory;
  parentOrg: string;
  orgName: string;
  orgType: OrgType;
  address: string;
  location: string;
  province: string;
  adminUnit: string;
  code: string;
  date: string;
  signerName: string;
  signerRole: string;
  signType: SignType;
  prompt: string;
  detailLevel: DetailLevel;
  style: DocStyle;
  audience: AudienceType;
}
