export interface IdeaPreset {
  id: string;
  category: "school" | "management" | "preschool" | "report" | "other";
  docType: string;
  title: string;
  shortDesc: string;
  fullPrompt: string;
  tags: string[];
}

export const IDEA_PRESETS: IdeaPreset[] = [
  // 1. School - Kế hoạch năm học
  {
    id: "idea-kh-namhoc",
    category: "school",
    docType: "Kế hoạch",
    title: "Kế hoạch thực hiện nhiệm vụ trọng tâm năm học",
    shortDesc: "Xác định mục tiêu chất lượng giáo dục toàn diện, chỉ tiêu thi đua và các giải pháp đột phá.",
    fullPrompt: "Xây dựng kế hoạch thực hiện nhiệm vụ năm học toàn diện với các mục tiêu: nâng cao chất lượng giáo dục mũi nhọn và đại trà, đẩy mạnh chuyển đổi số trong dạy học và quản lý, xây dựng trường học hạnh phúc, tăng cường giáo dục đạo đức lối sống và kỹ năng công dân số cho học sinh. Kế hoạch chia rõ các giai đoạn thực hiện, chỉ tiêu định lượng cụ thể, giải pháp chuyên môn, dự toán kinh phí và phân công trách nhiệm cho từng bộ phận.",
    tags: ["Năm học", "Chất lượng cao", "Chuyển đổi số", "Toàn diện"],
  },
  // 2. Management - Chuyển đổi số & AI
  {
    id: "idea-qd-chuyendoiso",
    category: "management",
    docType: "Quyết định",
    title: "Quyết định kiện toàn Ban Chỉ đạo chuyển đổi số và ứng dụng CNTT, AI",
    shortDesc: "Thành lập và phân công trách nhiệm ban chỉ đạo đẩy mạnh ứng dụng AI, hồ sơ số, chữ ký số.",
    fullPrompt: "Ban hành quyết định kiện toàn Ban Chỉ đạo chuyển đổi số, ứng dụng công nghệ thông tin và trí tuệ nhân tạo (AI) trong công tác quản lý điều hành và đổi mới phương pháp giảng dạy. Bao gồm danh sách cơ cấu ban chỉ đạo (Trưởng ban, Phó Trưởng ban, các Ủy viên phụ trách từng tổ chức năng), quy định cụ thể quyền hạn, trách nhiệm, quy chế làm việc, lộ trình triển khai số hóa hồ sơ sổ sách và chế độ giao ban định kỳ.",
    tags: ["Chuyển đổi số", "Trí tuệ nhân tạo", "Ban chỉ đạo", "Hồ sơ số"],
  },
  // 3. Preschool - STEAM
  {
    id: "idea-kh-steam",
    category: "preschool",
    docType: "Kế hoạch",
    title: "Kế hoạch chuyên đề ứng dụng phương pháp giáo dục STEAM mầm non",
    shortDesc: "Tổ chức hoạt động trải nghiệm khoa học, kỹ thuật, nghệ thuật, toán học cho trẻ theo lứa tuổi.",
    fullPrompt: "Lập kế hoạch triển khai chuyên đề ứng dụng phương pháp giáo dục tiên tiến STEAM trong trường mầm non theo từng khối lớp (nhà trẻ, mẫu giáo bé, mẫu giáo nhỡ, mẫu giáo lớn). Bao gồm mục tiêu phát triển tư duy sáng tạo, thiết kế môi trường xưởng sáng tạo mở, các dự án học tập STEAM theo tuần/tháng, ngày hội 'Bé sáng tạo cùng STEAM', kế hoạch tập huấn giáo viên, dự toán kinh phí học liệu và phối hợp cùng phụ huynh.",
    tags: ["Mầm non", "STEAM", "Trải nghiệm sáng tạo", "Giáo dục sớm"],
  },
  // 4. Report - Sơ kết học kỳ I
  {
    id: "idea-bc-soket-hk1",
    category: "report",
    docType: "Báo cáo",
    title: "Báo cáo sơ kết học kỳ I và phương hướng nhiệm vụ học kỳ II",
    shortDesc: "Đánh giá chi tiết kết quả học tập, rèn luyện, thi đua HK1 và giải pháp đột phá HK2.",
    fullPrompt: "Soạn thảo báo cáo toàn diện sơ kết học kỳ I và phương hướng nhiệm vụ trọng tâm học kỳ II. Báo cáo đánh giá sâu sắc trên tất cả các mặt: chất lượng giáo dục hai mặt, kết quả bồi dưỡng học sinh giỏi và phụ đạo học sinh, kiểm tra chuyên môn, đổi mới sinh hoạt tổ chuyên môn theo nghiên cứu bài học, ứng dụng CNTT, công tác đoàn thể và quản lý tài chính cơ sở vật chất. Phân tích rõ nguyên nhân ưu điểm, hạn chế và đề ra 6 nhóm nhiệm vụ, giải pháp trọng tâm cho học kỳ II.",
    tags: ["Sơ kết", "Học kỳ I", "Đánh giá chất lượng", "Nhiệm vụ HK2"],
  },
  // 5. School - Chuyên môn & Thao giảng
  {
    id: "idea-kh-chuyenmon",
    category: "school",
    docType: "Kế hoạch",
    title: "Kế hoạch tổ chức Hội thi Giáo viên dạy giỏi cấp trường chào mừng 20/11",
    shortDesc: "Đẩy mạnh phong trào thi đua dạy tốt - học tốt, đổi mới phương pháp giảng dạy tích cực.",
    fullPrompt: "Lập kế hoạch tổ chức Hội thi Giáo viên dạy giỏi cấp trường thiết thực chào mừng Ngày Nhà giáo Việt Nam 20/11. Nội dung kế hoạch chi tiết gồm: mục đích ý nghĩa, đối tượng và điều kiện dự thi, nội dung thi (trình bày biện pháp nâng cao chất lượng và thực hành tiết dạy đổi mới phương pháp), tiêu chí chấm điểm, ban giám khảo, thời gian từng vòng thi từ ngày 25/10 đến 15/11, cơ cấu giải thưởng, kinh phí khen thưởng và tổ chức tổng kết trao giải.",
    tags: ["Hội thi", "Giáo viên dạy giỏi", "Thi đua 20/11", "Chuyên môn"],
  },
  // 6. Other - Tờ trình CSVC & Thư viện
  {
    id: "idea-ttr-csvc",
    category: "other",
    docType: "Tờ trình",
    title: "Tờ trình xin phê duyệt chủ trương và kinh phí cải tạo thư viện số thông minh",
    shortDesc: "Đề xuất đầu tư cải tạo không gian đọc hiện đại, trang bị phần mềm thư viện số và máy tính.",
    fullPrompt: "Soạn tờ trình gửi cơ quan cấp có thẩm quyền xin phê duyệt chủ trương và phân bổ kinh phí đầu tư, nâng cấp thư viện nhà trường thành Thư viện số thông minh và không gian văn hóa đọc hiện đại. Trình bày rõ sự cần thiết thực tiễn, thực trạng cơ sở vật chất hiện tại chưa đáp ứng tiêu chuẩn thư viện tiên tiến theo Thông tư Bộ GD&ĐT, khái toán chi tiết các hạng mục xây dựng và mua sắm trang thiết bị (khoảng 350.000.000 VNĐ), nguồn vốn đối ứng và cam kết tiến độ hoàn thành.",
    tags: ["Tờ trình", "Cơ sở vật chất", "Thư viện số", "Đầu tư"],
  },
  // 7. School - Kiểm tra nội bộ
  {
    id: "idea-kh-kiemtra-noibo",
    category: "school",
    docType: "Kế hoạch",
    title: "Kế hoạch kiểm tra nội bộ trường học và chuyên đề chuyên môn",
    shortDesc: "Thiết lập kỷ cương, nâng cao trách nhiệm thực thi công vụ và bảo đảm quy chế chuyên môn.",
    fullPrompt: "Xây dựng kế hoạch công tác kiểm tra nội bộ trường học toàn diện trong năm học. Xác định rõ mục đích kiểm tra nhằm tư vấn, thúc đẩy nâng cao chất lượng chứ không mang tính quy chụp; đối tượng kiểm tra toàn diện giáo viên, kiểm tra chuyên đề hồ sơ giáo án, kiểm tra tài chính - tài sản công, kiểm tra an toàn vệ sinh trường học, kiểm tra công tác bán trú và nề nếp học sinh; lịch trình kiểm tra từng tháng; thành lập ban kiểm tra và mẫu biểu đánh giá.",
    tags: ["Kiểm tra nội bộ", "Kỷ cương", "Thanh tra chuyên môn", "Quy chế"],
  },
  // 8. Management - Quy chế làm việc
  {
    id: "idea-qc-lamviec",
    category: "management",
    docType: "Quy chế",
    title: "Quy chế làm việc và thực hiện dân chủ trong cơ quan, trường học",
    shortDesc: "Quy định nguyên tắc làm việc, trách nhiệm người đứng đầu, phối hợp đoàn thể và văn hóa công sở.",
    fullPrompt: "Soạn thảo Quy chế làm việc và thực hiện dân chủ ở cơ sở trong trường học. Quy định chi tiết các chương và điều khoản: nguyên tắc làm việc và trách nhiệm của Hiệu trưởng, Phó Hiệu trưởng, Tổ trưởng chuyên môn, Ban Thanh tra nhân dân; chế độ hội họp, thông tin báo cáo; quy trình xử lý văn bản điện tử; mối quan hệ công tác giữa Ban Giám hiệu với Chi bộ, Công đoàn và Đoàn thanh niên; văn hóa ứng xử, đạo đức nhà giáo và quy định khen thưởng, kỷ luật.",
    tags: ["Quy chế", "Quy chế làm việc", "Dân chủ cơ sở", "Văn hóa công sở"],
  },
  // 9. Preschool - Bán trú & An toàn vệ sinh
  {
    id: "idea-kh-bantru",
    category: "preschool",
    docType: "Kế hoạch",
    title: "Kế hoạch công tác bán trú, chăm sóc nuôi dưỡng và ATTP trường mầm non",
    shortDesc: "Bảo đảm dinh dưỡng cân đối, kiểm soát chặt chẽ nguồn gốc thực phẩm và phòng chống ngộ độc.",
    fullPrompt: "Lập kế hoạch chi tiết về công tác chăm sóc nuôi dưỡng, quản lý bán trú và bảo đảm an toàn vệ sinh thực phẩm trong trường mầm non. Các mục tiêu cụ thể gồm: 100% trẻ được cân đo chấm biểu đồ tăng trưởng, giảm tỷ lệ suy dinh dưỡng và thừa cân béo phì dưới 3%, quy trình giao nhận thực phẩm 3 bước và lưu mẫu thức ăn 24 giờ đúng quy định y tế, diễn tập phòng ngừa ngộ độc thực phẩm, tập huấn nhân viên nấu ăn, dự toán thực đơn đa dạng theo mùa và công khai minh bạch tài chính bán trú.",
    tags: ["Mầm non", "Bán trú", "An toàn thực phẩm", "Dinh dưỡng trẻ"],
  },
  // 10. School - Trường học hạnh phúc & An toàn
  {
    id: "idea-kh-truonghoc-hanhphuc",
    category: "school",
    docType: "Kế hoạch",
    title: "Kế hoạch xây dựng 'Trường học hạnh phúc – An toàn – Thân thiện'",
    shortDesc: "Xây dựng môi trường sư phạm nhân văn, phòng chống bạo lực học đường và giáo dục kỹ năng sống.",
    fullPrompt: "Xây dựng kế hoạch tổng thể triển khai phong trào thi đua 'Xây dựng trường học hạnh phúc, an toàn, không bạo lực học đường'. Kế hoạch gồm các trụ cột trọng tâm: xây dựng văn hóa giao tiếp ứng xử chuẩn mực giữa thầy cô và học sinh, tổ chức phòng tư vấn tâm lý học đường hoạt động hiệu quả, trang bị kỹ năng an toàn trên không gian mạng và phòng chống đuối nước, tai nạn thương tích, thiết kế các hoạt động ngoại khóa, câu lạc bộ sở thích tạo niềm vui mỗi ngày đến trường cho học sinh.",
    tags: ["Trường học hạnh phúc", "Kỹ năng sống", "Tư vấn tâm lý", "An toàn học đường"],
  },
  // 11. Report - Tổng kết năm học
  {
    id: "idea-bc-tongket-namhoc",
    category: "report",
    docType: "Báo cáo",
    title: "Báo cáo tổng kết toàn diện năm học và phong trào thi đua",
    shortDesc: "Đánh giá kết quả đạt được đối chiếu với chỉ tiêu đầu năm, biểu dương thành tích xuất sắc.",
    fullPrompt: "Soạn thảo báo cáo tổng kết toàn diện việc thực hiện nhiệm vụ năm học và phong trào thi đua đổi mới sáng tạo trong dạy và học. Nội dung báo cáo phân tích đối chiếu hệ thống số liệu định lượng với các chỉ tiêu đã cam kết từ đầu năm: tỷ lệ hoàn thành chương trình, học sinh giỏi các cấp, giải thưởng giáo viên dạy giỏi, sáng kiến kinh nghiệm được công nhận, công tác xây dựng trường chuẩn quốc gia và chuyển đổi số. Nêu rõ bài học kinh nghiệm sâu sắc và phương hướng nhiệm vụ năm học kế tiếp.",
    tags: ["Tổng kết", "Năm học", "Báo cáo toàn diện", "Thi đua khen thưởng"],
  },
  // 12. Management - Thông báo tuyển sinh
  {
    id: "idea-tb-tuyensinh",
    category: "management",
    docType: "Thông báo",
    title: "Thông báo kế hoạch tuyển sinh đầu cấp và tiếp nhận hồ sơ học sinh",
    shortDesc: "Công khai chỉ tiêu, độ tuổi, tuyến tuyển sinh, phương thức trực tuyến và thời gian tiếp nhận.",
    fullPrompt: "Soạn thông báo chính thức về công tác tuyển sinh đầu cấp năm học mới của nhà trường. Nội dung thông báo cụ thể gồm: chỉ tiêu tuyển sinh từng khối lớp, phân tuyến địa bàn tuyển sinh theo quy định của Ban Chỉ đạo tuyển sinh địa phương, điều kiện và độ tuổi của học sinh, hướng dẫn phụ huynh đăng ký trực tuyến trên Cổng dịch vụ công/phần mềm tuyển sinh ngành giáo dục, thời gian nộp hồ sơ trực tiếp đối soát, thành phần hồ sơ cần chuẩn bị và số điện thoại đường dây nóng hỗ trợ.",
    tags: ["Thông báo", "Tuyển sinh", "Đầu cấp", "Công khai trực tuyến"],
  },
];
