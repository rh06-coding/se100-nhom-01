# AI-log TH2 — Duy · ph1-man-hinh

## Phiên 1: Thiết kế giao diện form và Dark Mode (Prompt 1)
**Tôi hỏi:** Thiết kế form đặt phòng tự học gồm các trường họ tên, MSSV, chọn phòng, ngày, giờ bắt đầu và kết thúc với giao diện Dark Mode hiện đại, responsive trên mobile bằng CSS thuần.
**Agent trả lời:** Cung cấp cấu trúc HTML semantic kèm CSS biến màu Dark Mode (`--clr-bg: #0f172a`, `--clr-surface: #1e293b`, `--clr-primary: #6366f1`) và flex/grid layout tự co giãn khi màn hình hẹp.
**Tôi quyết định:** Tách toàn bộ CSS vào `index.html`, còn mã dựng form chuyển vào `form.js` dưới dạng template function để có thể tái sử dụng hoặc nạp động.

## Phiên 2: Validation UI và Dynamic Dropdown giờ kết thúc (Prompt 2)
**Tôi hỏi:** Khi người dùng chọn giờ bắt đầu, làm sao để dropdown giờ kết thúc chỉ hiển thị các mốc thời gian lớn hơn giờ bắt đầu? Và validation MSSV cần chuẩn thế nào?
**Agent trả lời:** Lắng nghe sự kiện `change` trên `#gio-bat-dau`, lọc mảng `KHUNG_GIO` lấy các mốc `g > gioBatDauChon` và tạo động các thẻ `<option>`. Đồng thời dùng Regex `/^\d{8}$/` kiểm tra đúng 8 chữ số MSSV trước khi submit.
**Điều học được:** Lọc giờ kết thúc ngay từ UI giúp ngăn chặn lỗi chọn ngược giờ từ sớm, giảm bớt tải kiểm tra cho tầng luật nghiệp vụ phía sau.

## Phiên 3: Thiết kế callback onSubmit cho Người 4 ghép luồng (Prompt 3)
**Tôi hỏi:** form.js không nên tự lưu dữ liệu hay tự kiểm tra trùng giờ, vậy xuất dữ liệu ra ngoài cho các bạn khác như thế nào?
**Agent trả lời:** Dùng callback pattern: hàm `khoiTaoForm(containerEl, onSubmit)` nhận vào hàm callback `onSubmit(duLieu)`. Khi bấm nút Đặt và vượt qua validation sơ bộ, form gọi callback truyền object dữ liệu thô ra ngoài. Đồng thời cung cấp thêm hàm `hienThiThongBaoForm(containerEl, noiDung, loai)` để Người 4 có thể hiển thị thông báo lỗi từ tầng luật ngược lại lên form.
(commit 42c2c60)

## Điều học được ở TH2 (cụ thể về hệ thống):
Validation UI chỉ xử lý định dạng bề nổi (bắt buộc nhập, định dạng số, ngày không âm). Ràng buộc logic sâu như trùng giờ phòng học phải do module chuyên biệt (`rules.js`) đảm nhiệm. Callback pattern giúp giữ ranh giới độc lập giữa màn hình nhập và tầng xử lý nghiệp vụ.
