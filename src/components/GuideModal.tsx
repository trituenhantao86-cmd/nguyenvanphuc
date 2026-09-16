import React from "react";
import { X, BookOpen, CheckCircle2, ShieldAlert, Sparkles, Scale } from "lucide-react";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Hướng dẫn sử dụng PHÚC AI
              </h2>
              <p className="text-xs text-slate-500">
                Quy trình 4 bước và cẩm nang thể thức văn bản hành chính theo Nghị định 30/2020/NĐ-CP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Process */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Quy trình soạn thảo 4 bước nhanh gọn:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1">
              <span className="font-bold text-sky-900 block">Bước 1: Chọn mẫu & nhập yêu cầu</span>
              <p className="text-slate-600 leading-relaxed">
                Chọn thể loại văn bản (Kế hoạch, Quyết định, Báo cáo, Mầm non...) và mô tả nội dung bằng tiếng Việt thông thường.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1">
              <span className="font-bold text-sky-900 block">Bước 2: AI tự động phân tích & soạn</span>
              <p className="text-slate-600 leading-relaxed">
                Hệ thống tự động thiết lập các căn cứ pháp luật, mục đích, yêu cầu, các mục phân công nhiệm vụ chi tiết.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1">
              <span className="font-bold text-sky-900 block">Bước 3: Xem trước A4 & kiểm tra lỗi</span>
              <p className="text-slate-600 leading-relaxed">
                Quan sát trực quan trang giấy A4, dùng AI tinh chỉnh văn phong, kiểm tra điểm thể thức và rà soát cơ quan ban hành.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1">
              <span className="font-bold text-sky-900 block">Bước 4: Xuất file Word (.docx)</span>
              <p className="text-slate-600 leading-relaxed">
                Tải về máy tệp Microsoft Word thật sự với font Times New Roman, căn lề chuẩn chỉ việc ký và phát hành.
              </p>
            </div>
          </div>
        </div>

        {/* Decree 30 Formatting Reference Table */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Scale className="w-4 h-4 text-sky-600" />
            <span>Tiêu chuẩn kỹ thuật trình bày (Nghị định 30/2020/NĐ-CP):</span>
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Thành phần thể thức</th>
                  <th className="p-2.5">Cỡ chữ</th>
                  <th className="p-2.5">Kiểu chữ</th>
                  <th className="p-2.5">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-2.5 font-medium">Quốc hiệu</td>
                  <td className="p-2.5">12 - 13</td>
                  <td className="p-2.5 font-bold">In hoa, đứng, đậm</td>
                  <td className="p-2.5 text-slate-500">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Tiêu ngữ</td>
                  <td className="p-2.5">13 - 14</td>
                  <td className="p-2.5 font-bold">In thường, đứng, đậm</td>
                  <td className="p-2.5 text-slate-500">Độc lập - Tự do - Hạnh phúc (có gạch dưới)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Tên đơn vị ban hành</td>
                  <td className="p-2.5">12 - 13</td>
                  <td className="p-2.5 font-bold">In hoa, đứng, đậm</td>
                  <td className="p-2.5 text-slate-500">Có đường kẻ liền bên dưới</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Tên loại văn bản</td>
                  <td className="p-2.5">14</td>
                  <td className="p-2.5 font-bold">In hoa, đứng, đậm</td>
                  <td className="p-2.5 text-slate-500">Đặt giữa trang giấy (KẾ HOẠCH, QUYẾT ĐỊNH)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Căn lề trang giấy A4</td>
                  <td className="p-2.5" colSpan={3}>
                    Trên: 20-25mm | Dưới: 20-25mm | Trái: 30-35mm | Phải: 15-20mm
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Special Rule: No County Level */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1.5">
          <span className="font-bold text-amber-900 flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Quy tắc đặc biệt: “Không còn cấp huyện” trong mô hình tổ chức</span>
          </span>
          <p className="text-amber-800 leading-relaxed">
            Hệ thống tự động phát hiện và cảnh báo nếu người dùng nhập hoặc trích dẫn các cơ quan hành chính cấp huyện cũ không còn phù hợp với mô hình thẩm quyền hiện hành. Với các căn cứ lịch sử, hệ thống giữ nguyên nhưng sẽ đưa ra khuyến cáo để người dùng rà soát thẩm quyền ban hành.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20"
          >
            Đã hiểu, đóng hướng dẫn
          </button>
        </div>
      </div>
    </div>
  );
};
