# Hồi cứu Tuần 3 — Ghép luồng chính TH2

> **Mục C2 hướng dẫn TH2:** Ghi nhận sự lệch kiểu/khác biệt giữa các module trước khi sửa để phục vụ đánh giá và hồi cứu ở Tuần 4.

---

## 1. Lệch kiểu giữa Người 1 (`form.js`) và Người 2 (`rules.js`)

- **Thực tế:**
  - Người 1 (`form.js`) gửi qua callback `onSubmit(data)` một object tổng hợp:
    ```javascript
    {
      tenSV: "...",
      mssv: "...",
      maPhong: "...",
      tenPhong: "...",
      ngay: "...",
      gioBatDau: "...",
      gioKetThuc: "..."
    }
    ```
  - Người 2 (`rules.js`) export 2 hàm riêng biệt:
    1. `kiemTraHopLeThoiGian(gioBatDau, gioKetThuc)`: mong đợi 2 tham số chuỗi rời rạc (`HH:mm`), không nhận cả object.
    2. `kiemTraTrungGio(phieuMoi, danhSachPhieu)`: nhận `phieuMoi` và mảng `danhSachPhieu`, trả về `{ trung: boolean, trungVoi: object | null }` mà **không** kèm thông điệp lỗi dạng chuỗi cho người dùng.
- **Nguyên nhân:** Trước khi code, nhóm chỉ thỏa thuận miệng về các trường dữ liệu mà chưa chốt chữ ký hàm (function signature) cụ thể giữa tầng form và tầng luật.
- **Cách Người 4 xử lý khi ghép:**
  - Trong `main.js`, bóc tách `duLieuForm.gioBatDau` và `duLieuForm.gioKetThuc` để truyền vào `kiemTraHopLeThoiGian`.
  - Gọi `kiemTraTrungGio(duLieuForm, layTatCaPhieu())`. Nếu `trung === true`, `main.js` tự ghép chuỗi thông báo lỗi:
    `"Phòng ... đã có người đặt trong khung giờ này (trùng phiếu ...)"` để gửi cho cả `view.js` và `form.js`.

---

## 2. Lệch kiểu giữa Người 1 (`form.js`) và Người 4 (`view.js` ban đầu)

- **Thực tế:**
  - Người 1 dùng tên thuộc tính: `tenSV` và `mssv`. Trong `index.html`, Người 1 tạo sẵn container `<section id="lich-su">` và định nghĩa style dạng card `.phieu-item`.
  - Người 4 ban đầu trong `view.js` mong đợi trường `nguoiDat` hoặc `sinhVien`, tìm container `#danh-sach-phieu` và render dạng bảng `<table>`.
- **Hậu quả nếu không đồng bộ:** Cột người đặt bị rỗng, và xuất hiện thêm một container rác ngoài thẻ `#lich-su` đã có.
- **Cách Người 4 xử lý:**
  - Cập nhật `view.js` ưu tiên bắt container `#lich-su`.
  - Đọc trường `phieu.tenSV` và `phieu.mssv` (đồng thời giữ fallback).
  - Chuyển từ render bảng sang render card `.phieu-item` bằng DOM thuần (`createElement`, `textContent`) để vừa khớp giao diện Dark Mode của Người 1, vừa bảo vệ chống tấn công XSS.

---

## 3. Khác biệt giữa Người 3 (`storage.js`) và Các thành viên khác

- **Thực tế:**
  - Người 3 tự sinh mã phiếu có tiền tố `'PDC-' + Date.now()` và trạng thái cố định là `'ChoDuyet'` (CamelCase không dấu, không khoảng trắng).
  - Ban đầu Người 4 dự kiến chuỗi `'Chờ duyệt'` có dấu tiếng Việt.
- **Cách xử lý:** Thống nhất dùng giá trị `'ChoDuyet'` từ `storage.js` làm chuẩn, `view.js` hiển thị nhãn này trong thẻ badge `.trang-thai`.

---

## 4. Bài học rút ra cho Vòng 2

1. **Cần Data Contract bằng văn bản trước khi rẽ nhánh:** Không chỉ thỏa thuận cấu trúc dữ liệu của thực thể (Entity), mà phải chốt tên hàm, danh sách tham số và kiểu trả về của từng hàm export.
2. **Vai trò điều phối của `main.js`:** Module `main.js` đóng vai trò Mediator chuyển đổi và thích ứng dữ liệu (Adapter) giữa các module độc lập, giúp các thành viên phát triển song song mà không làm gãy luồng của nhau.
