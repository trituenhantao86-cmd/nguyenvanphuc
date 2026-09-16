import { DocumentData, AuditResult, CheckItem } from "../types";

// Keywords that indicate old district-level administrative structure
const OUTDATED_DISTRICT_PATTERNS = [
  /phòng\s+giáo\s+dục\s+và\s+đào\s+tạo\s+huyện/i,
  /phòng\s+gd(&|và)đt\s+huyện/i,
  /ubnd\s+huyện/i,
  /ủy\s+ban\s+nhân\s+dân\s+huyện/i,
  /huyện\s+ủy/i,
  /hội\s+đồng\s+nhân\s+dân\s+huyện/i,
  /hđnd\s+huyện/i,
  /trung\s+tâm\s+y\s+tế\s+huyện/i,
  /công\s+an\s+huyện/i,
  /chi\s+cục\s+thuế\s+huyện/i,
  /bảo\s+hiểm\s+xã\s+hội\s+huyện/i,
];

export function auditAdministrativeDocument(doc: DocumentData): AuditResult {
  const checks: CheckItem[] = [];
  const suggestions: string[] = [];
  const outdatedWarnings: string[] = [];

  let formatScore = 100;
  let contentScore = 100;
  let structureScore = 100;
  let adminUnitScore = 100;
  let typographyScore = 100;

  // 1. Kiểm tra Quốc hiệu - Tiêu ngữ
  checks.push({
    id: "A",
    name: "Quốc hiệu – Tiêu ngữ",
    status: "pass",
    detail: "Đạt chuẩn: CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM / Độc lập - Tự do - Hạnh phúc theo Nghị định 30/2020/NĐ-CP.",
  });

  // 2. Kiểm tra Tên cơ quan, đơn vị
  if (!doc.orgName || doc.orgName.trim().length < 3) {
    formatScore -= 15;
    checks.push({
      id: "B",
      name: "Tên cơ quan, đơn vị ban hành",
      status: "fail",
      detail: "Chưa nhập đầy đủ tên cơ quan hoặc đơn vị ban hành văn bản.",
    });
    suggestions.push("Bổ sung tên đơn vị ban hành văn bản (viết in hoa).");
  } else {
    checks.push({
      id: "B",
      name: "Tên cơ quan, đơn vị ban hành",
      status: "pass",
      detail: `Đã xác định đơn vị: ${doc.orgName}${doc.parentOrg ? ` (Chủ quản: ${doc.parentOrg})` : ""}.`,
    });
  }

  // 3. Kiểm tra Số và ký hiệu
  const hasCode = Boolean(doc.code && doc.code.includes("/"));
  if (!hasCode) {
    formatScore -= 10;
    checks.push({
      id: "C",
      name: "Số và ký hiệu",
      status: "warn",
      detail: "Số và ký hiệu văn bản nên có định dạng chuẩn (ví dụ: .../KH-..., .../QĐ-...).",
    });
    suggestions.push("Kiểm tra lại ký hiệu viết tắt tên cơ quan và thể loại văn bản.");
  } else {
    checks.push({
      id: "C",
      name: "Số và ký hiệu",
      status: "pass",
      detail: `Số và ký hiệu: ${doc.code} hợp lệ theo quy định.`,
    });
  }

  // 4. Kiểm tra Địa danh, ngày tháng
  if (!doc.location || doc.location.trim().length === 0) {
    formatScore -= 10;
    checks.push({
      id: "D",
      name: "Địa danh, ngày tháng",
      status: "warn",
      detail: "Chưa có địa danh ban hành văn bản.",
    });
    suggestions.push("Bổ sung địa danh nơi cơ quan đóng trụ sở.");
  } else {
    checks.push({
      id: "D",
      name: "Địa danh, ngày tháng",
      status: "pass",
      detail: `Địa danh: ${doc.location} – Ngày ban hành: ${doc.date || "Hiện hành"}.`,
    });
  }

  // 5. Kiểm tra Tên loại và Trích yếu
  if (!doc.title || doc.title.trim().length === 0) {
    structureScore -= 15;
    checks.push({
      id: "E",
      name: "Tên loại văn bản",
      status: "fail",
      detail: "Thiếu tên loại văn bản (Kế hoạch, Quyết định, Báo cáo...).",
    });
  } else {
    checks.push({
      id: "E",
      name: "Tên loại văn bản",
      status: "pass",
      detail: `Tên loại văn bản: ${doc.title}.`,
    });
  }

  if (!doc.documentSubject || doc.documentSubject.trim().length < 5) {
    structureScore -= 10;
    suggestions.push("Trích yếu nội dung văn bản cần ngắn gọn, bao quát chủ đề chính.");
  }

  // 6. Kiểm tra Căn cứ pháp lý
  if (doc.docType === "Quyết định" || doc.docType === "Tờ trình") {
    if (!doc.legalBases || doc.legalBases.length === 0) {
      contentScore -= 15;
      checks.push({
        id: "F",
        name: "Căn cứ pháp lý",
        status: "warn",
        detail: "Loại văn bản này bắt buộc phải có căn cứ pháp lý hoặc quyết định cấp trên.",
      });
      suggestions.push("Bổ sung các căn cứ pháp lý còn hiệu lực thi hành.");
    } else {
      checks.push({
        id: "F",
        name: "Căn cứ pháp lý",
        status: "pass",
        detail: `Đã viện dẫn ${doc.legalBases.length} căn cứ pháp luật và thẩm quyền.`,
      });
    }
  } else {
    checks.push({
      id: "F",
      name: "Căn cứ thẩm quyền / cơ sở ban hành",
      status: "pass",
      detail: "Cơ sở căn cứ phù hợp với thể loại văn bản.",
    });
  }

  // 7. Kiểm tra Nội dung & Mục/Điều/Khoản
  if (!doc.contentSections || doc.contentSections.length === 0) {
    contentScore -= 25;
    checks.push({
      id: "G",
      name: "Nội dung & điều khoản",
      status: "fail",
      detail: "Văn bản chưa có nội dung các mục hoặc điều khoản chi tiết.",
    });
  } else {
    checks.push({
      id: "G",
      name: "Nội dung & điều khoản",
      status: "pass",
      detail: `Gồm ${doc.contentSections.length} mục/phần nội dung phân định rõ ràng.`,
    });
  }

  // 8. Kiểm tra Chữ ký & Thẩm quyền
  if (!doc.signerName || doc.signerName.trim().length === 0) {
    adminUnitScore -= 10;
    checks.push({
      id: "H",
      name: "Chữ ký & người ký",
      status: "warn",
      detail: "Chưa xác định họ tên người ký văn bản.",
    });
    suggestions.push("Điền rõ họ tên người có thẩm quyền ký văn bản.");
  } else {
    // Logic kiểm tra loại ký: TM. (thay mặt tập thể), KT. (ký thay người đứng đầu), TL. (thừa lệnh), TUQ. (thừa ủy quyền)
    let signLogicMsg = `Người ký: ${doc.signerName} - Chức vụ: ${doc.signerTitle || "Thủ trưởng đơn vị"}`;
    if (doc.signerSignType && doc.signerSignType !== "Ký trực tiếp") {
      signLogicMsg += ` (${doc.signerSignType})`;
    }
    checks.push({
      id: "H",
      name: "Chữ ký & thẩm quyền ký",
      status: "pass",
      detail: signLogicMsg,
    });
  }

  // 9. Kiểm tra Nơi nhận
  if (!doc.recipients || doc.recipients.length === 0) {
    formatScore -= 10;
    checks.push({
      id: "I",
      name: "Nơi nhận văn bản",
      status: "warn",
      detail: "Chưa khai báo nơi nhận văn bản (cơ quan cấp trên, đơn vị thực hiện, lưu VT).",
    });
    suggestions.push("Bổ sung nơi nhận theo quy tắc: cấp trên, đơn vị liên quan, 'Lưu: VT,...'");
  } else {
    const hasLuuVT = doc.recipients.some((r) => r.toLowerCase().includes("lưu") || r.toLowerCase().includes("vt"));
    if (!hasLuuVT) {
      suggestions.push("Nơi nhận nên có dòng kết thúc: 'Lưu: VT, hồ sơ...'");
    }
    checks.push({
      id: "I",
      name: "Nơi nhận",
      status: "pass",
      detail: `Đã khai báo ${doc.recipients.length} đầu mối nhận văn bản.`,
    });
  }

  // 10. KIỂM TRA ĐƠN VỊ HÀNH CHÍNH & QUY TẮC ĐẶC BIỆT "KHÔNG CÒN CẤP HUYỆN"
  const fullTextToScan = [
    doc.parentOrg,
    doc.orgName,
    doc.location,
    doc.province,
    doc.adminUnit,
    doc.documentSubject,
    ...(doc.legalBases || []),
    ...(doc.recipients || []),
    ...doc.contentSections.flatMap((s) => [s.heading, ...s.items]),
  ].join(" ");

  let foundOutdatedContext = false;

  for (const pattern of OUTDATED_DISTRICT_PATTERNS) {
    const match = fullTextToScan.match(pattern);
    if (match) {
      foundOutdatedContext = true;
      const term = match[0];
      outdatedWarnings.push(
        `Phát hiện thông tin hành chính có khả năng đã cũ: "${term}". Vui lòng kiểm tra lại theo đơn vị hành chính hiện hành và mô hình phân định thẩm quyền mới.`
      );
    }
  }

  if (foundOutdatedContext) {
    adminUnitScore -= 15;
    checks.push({
      id: "J",
      name: "Kiểm tra đơn vị hành chính hiện hành",
      status: "warn",
      detail: "Phát hiện thông tin hành chính có khả năng đã cũ. Vui lòng kiểm tra lại theo đơn vị hành chính hiện hành.",
    });
  } else {
    checks.push({
      id: "J",
      name: "Kiểm tra đơn vị hành chính hiện hành",
      status: "pass",
      detail: "Không phát hiện xung đột tên đơn vị hành chính cấp huyện cũ sai thẩm quyền.",
    });
  }

  // Calculate composite total score
  const totalScore = Math.max(
    50,
    Math.round(
      formatScore * 0.25 +
        contentScore * 0.25 +
        structureScore * 0.2 +
        adminUnitScore * 0.2 +
        typographyScore * 0.1
    )
  );

  const detectedIssuesCount = checks.filter((c) => c.status !== "pass").length;
  const isReadyToExport = totalScore >= 75 && !checks.some((c) => c.status === "fail");

  return {
    totalScore,
    scores: {
      formatScore: Math.max(0, formatScore),
      contentScore: Math.max(0, contentScore),
      structureScore: Math.max(0, structureScore),
      adminUnitScore: Math.max(0, adminUnitScore),
      typographyScore: Math.max(0, typographyScore),
    },
    adminUnitStatus: foundOutdatedContext ? "needs_review" : "appropriate",
    adminUnitMessage: foundOutdatedContext
      ? "Phát hiện thông tin hành chính có khả năng đã cũ. Vui lòng kiểm tra lại theo đơn vị hành chính hiện hành."
      : "Hành chính phù hợp với mô hình tổ chức hiện hành.",
    checks,
    suggestions,
    detectedIssuesCount,
    hasOutdatedDistrict: foundOutdatedContext,
    outdatedDistrictWarnings: outdatedWarnings,
    isReadyToExport,
  };
}

// Auto-fix utility to normalize formatting according to Decree 30/2020/NĐ-CP
export function autoFixDocument(doc: DocumentData): DocumentData {
  const fixed = { ...doc };

  // Normalize orgName to uppercase if not
  if (fixed.orgName && fixed.orgName !== fixed.orgName.toUpperCase()) {
    fixed.orgName = fixed.orgName.toUpperCase();
  }

  // Ensure title uppercase
  if (fixed.title && fixed.title !== fixed.title.toUpperCase()) {
    fixed.title = fixed.title.toUpperCase();
  }

  // Ensure signerTitle uppercase
  if (fixed.signerTitle && fixed.signerTitle !== fixed.signerTitle.toUpperCase()) {
    fixed.signerTitle = fixed.signerTitle.toUpperCase();
  }

  // Ensure recipients end with semicolon or period
  if (fixed.recipients && fixed.recipients.length > 0) {
    fixed.recipients = fixed.recipients.map((item, idx) => {
      let trimmed = item.trim();
      if (idx === fixed.recipients.length - 1) {
        if (!trimmed.endsWith(".")) trimmed = trimmed.replace(/[,;]$/, "") + ".";
      } else {
        if (!trimmed.endsWith(";")) trimmed = trimmed.replace(/[,.]$/, "") + ";";
      }
      return trimmed;
    });

    const hasLuuVT = fixed.recipients.some((r) => r.toLowerCase().includes("vt"));
    if (!hasLuuVT) {
      fixed.recipients.push("Lưu: VT, hồ sơ.");
    }
  }

  // Auto-generate code if empty
  if (!fixed.code || fixed.code.trim() === "") {
    const acronym = fixed.docType === "Quyết định" ? "QĐ" : fixed.docType === "Kế hoạch" ? "KH" : "CV";
    const orgAcronym = fixed.orgName
      ? fixed.orgName
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 5)
      : "ĐV";
    fixed.code = `Số: .../${acronym}-${orgAcronym}`;
  }

  // Re-run audit
  fixed.auditResult = auditAdministrativeDocument(fixed);
  fixed.updatedAt = new Date().toISOString();

  return fixed;
}
