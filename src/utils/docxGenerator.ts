import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  Footer,
  PageNumber,
  convertMillimetersToTwip,
} from "docx";
import { DocumentData } from "../types";

// Helper to sanitize Vietnamese string for file name
export function sanitizeFileName(str: string): string {
  if (!str) return "VanBan";
  // Remove accents
  const noAccents = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
  // Replace spaces and special chars
  return noAccents
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export function generateFileName(doc: DocumentData): string {
  const typePart = sanitizeFileName(doc.docType || "VanBan");
  const orgPart = sanitizeFileName(doc.orgName || "DonVi").slice(0, 25);
  const dateStr = doc.date ? sanitizeFileName(doc.date) : new Date().toISOString().slice(0, 10);
  return `${typePart}_${orgPart}_${dateStr}.docx`;
}

// Generate valid Microsoft Word .docx conforming to Nghị định 30/2020/NĐ-CP
export async function generateDocxBlob(doc: DocumentData): Promise<Blob> {
  const font = "Times New Roman";

  // Standard margins in twips (1 mm ≈ 56.7 twips)
  // Top: 20mm (1134), Bottom: 20mm (1134), Left: 30mm (1701), Right: 20mm (1134)
  const topMargin = convertMillimetersToTwip(20);
  const bottomMargin = convertMillimetersToTwip(20);
  const leftMargin = convertMillimetersToTwip(30);
  const rightMargin = convertMillimetersToTwip(20);

  // Border none definition for header and footer layout tables
  const noBorder = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

  // Header Table: 2 columns
  // Col 1 (approx 45%): Agency name + Code
  // Col 2 (approx 55%): National motto + Location/Date
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorder,
    rows: [
      new TableRow({
        children: [
          // Left cell: Tên cơ quan chủ quản / Tên đơn vị ban hành / Số ký hiệu
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              ...(doc.parentOrg
                ? [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 40 },
                      children: [
                        new TextRun({
                          text: doc.parentOrg.toUpperCase(),
                          font,
                          size: 24, // 12pt
                        }),
                      ],
                    }),
                  ]
                : []),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: (doc.orgName || "TÊN CƠ QUAN, ĐƠN VỊ").toUpperCase(),
                    font,
                    bold: true,
                    size: 24, // 12pt in hoa đậm
                  }),
                ],
              }),
              // Decorative underline below agency name
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: "————————",
                    font,
                    bold: true,
                    size: 16,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: doc.code || "Số: .../KH-...",
                    font,
                    size: 24, // 12pt
                  }),
                ],
              }),
            ],
          }),

          // Right cell: Quốc hiệu & Tiêu ngữ / Địa danh, ngày tháng
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                    font,
                    bold: true,
                    size: 24, // 12pt in hoa đậm
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: "Độc lập - Tự do - Hạnh phúc",
                    font,
                    bold: true,
                    size: 26, // 13pt
                  }),
                ],
              }),
              // Decorative underline below motto
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: "————————————",
                    font,
                    bold: true,
                    size: 18,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: doc.date
                      ? `${doc.location || "Địa danh"}, ${doc.date}`
                      : `${doc.location || "Địa danh"}, ngày ... tháng ... năm 202...`,
                    font,
                    italics: true,
                    size: 26, // 13pt nghiêng
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Body Paragraphs
  const bodyChildren: (Paragraph | Table)[] = [headerTable];

  // Spacer
  bodyChildren.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [],
    })
  );

  // Document Title (Tên loại văn bản)
  bodyChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 60 },
      children: [
        new TextRun({
          text: (doc.title || doc.docType || "VĂN BẢN HÀNH CHÍNH").toUpperCase(),
          font,
          bold: true,
          size: 28, // 14pt in hoa đậm
        }),
      ],
    })
  );

  // Document Subject (Trích yếu nội dung)
  if (doc.documentSubject) {
    bodyChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: doc.documentSubject,
            font,
            bold: true,
            size: 26, // 13pt
          }),
        ],
      })
    );
  }

  // Legal bases (Căn cứ pháp lý)
  if (doc.legalBases && doc.legalBases.length > 0) {
    doc.legalBases.forEach((base, index) => {
      const isLast = index === doc.legalBases.length - 1;
      let text = base.trim();
      if (!text.startsWith("Căn cứ")) {
        text = `Căn cứ ${text}`;
      }
      if (!text.endsWith(";") && !text.endsWith(".")) {
        text += isLast ? ";" : ";";
      }

      bodyChildren.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: convertMillimetersToTwip(12.7) },
          spacing: { before: 40, after: 40, line: 300 }, // 1.25 line spacing
          children: [
            new TextRun({
              text,
              font,
              italics: true,
              size: 26, // 13pt - 14pt nghiêng
            }),
          ],
        })
      );
    });

    // Spacer after bases
    bodyChildren.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [],
      })
    );
  }

  // Content Sections (Các phần, mục, nội dung)
  if (doc.contentSections && doc.contentSections.length > 0) {
    doc.contentSections.forEach((section) => {
      // Section Heading
      if (section.heading) {
        bodyChildren.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 180, after: 80 },
            children: [
              new TextRun({
                text: section.heading,
                font,
                bold: true,
                size: 28, // 14pt đậm
              }),
            ],
          })
        );
      }

      // Section Items
      if (section.items && section.items.length > 0) {
        section.items.forEach((item) => {
          bodyChildren.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              indent: { firstLine: convertMillimetersToTwip(12.7) },
              spacing: { before: 50, after: 50, line: 300 }, // 1.25 line spacing
              children: [
                new TextRun({
                  text: item,
                  font,
                  size: 28, // 14pt
                }),
              ],
            })
          );
        });
      }
    });
  }

  // Spacer before Signature Block
  bodyChildren.push(
    new Paragraph({
      spacing: { before: 240, after: 100 },
      children: [],
    })
  );

  // Signer & Recipients Table: 2 columns
  // Left: Nơi nhận
  // Right: Chức vụ, Thẩm quyền ký, Họ tên
  const recipientParagraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "Nơi nhận:",
          font,
          bold: true,
          italics: true,
          size: 24, // 12pt đậm nghiêng
        }),
      ],
    }),
  ];

  if (doc.recipients && doc.recipients.length > 0) {
    doc.recipients.forEach((rec) => {
      recipientParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 20 },
          children: [
            new TextRun({
              text: `- ${rec}`,
              font,
              size: 22, // 11pt
            }),
          ],
        })
      );
    });
  } else {
    recipientParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [new TextRun({ text: "- Như trên;", font, size: 22 })],
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [new TextRun({ text: "- Lưu: VT, hồ sơ.", font, size: 22 })],
      })
    );
  }

  const signerParagraphs: Paragraph[] = [];

  // Signer Type (TM., KT., TL., TUQ. or direct)
  if (doc.signerSignType && doc.signerSignType !== "Ký trực tiếp") {
    signerParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: doc.signerSignType,
            font,
            bold: true,
            size: 28, // 14pt
          }),
        ],
      })
    );
  }

  // Signer Title (HIỆU TRƯỞNG, CHỦ TỊCH, TRƯỞNG PHÒNG...)
  signerParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: (doc.signerTitle || "THỦ TRƯỞNG ĐƠN VỊ").toUpperCase(),
          font,
          bold: true,
          size: 28, // 14pt in hoa đậm
        }),
      ],
    })
  );

  // Blank spacing for physical / digital signature stamp
  signerParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 100 },
      children: [
        new TextRun({
          text: "(Ký, đóng dấu)",
          font,
          italics: true,
          size: 22, // 11pt
        }),
      ],
    })
  );

  // Signer Full Name
  signerParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: doc.signerName || "Nguyễn Văn A",
          font,
          bold: true,
          size: 28, // 14pt
        }),
      ],
    })
  );

  const signatureTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorder,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: recipientParagraphs,
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: signerParagraphs,
          }),
        ],
      }),
    ],
  });

  bodyChildren.push(signatureTable);

  // Construct Document with Section and Page Number Footer
  const docxDocument = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: topMargin,
              bottom: bottomMargin,
              left: leftMargin,
              right: rightMargin,
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font,
                    size: 26, // 13pt
                  }),
                ],
              }),
            ],
          }),
        },
        children: bodyChildren,
      },
    ],
  });

  // Pack to Blob
  const blob = await Packer.toBlob(docxDocument);

  // Verify blob validity
  if (!blob || blob.size < 100) {
    throw new Error("Không thể tạo file Word hợp lệ. Dung lượng file bất thường.");
  }

  return blob;
}

// Download triggering function in browser
export function downloadDocx(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}
