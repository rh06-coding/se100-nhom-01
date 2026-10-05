# AI-log TH2 — Hoàng · ph4-ket-qua-ghep

## Phiên 1: Hỏi cách render danh sách chống XSS (Prompt 1)
**Tôi hỏi:** Hiển thị danh sách phiếu đặt phòng lấy từ storage bằng innerHTML hay DOM createElement? Có nguy cơ gì?
**Agent trả lời:** Dùng innerHTML với chuỗi nối dễ bị lỗi Cross-Site Scripting (XSS) nếu người dùng nhập tên hoặc ghi chú chứa mã JavaScript (ví dụ: `<img src=x onerror=alert(1)>`). Đề xuất dùng `document.createElement`, `textContent` và `replaceChildren`.
**Tôi quyết định:** Triệt để áp dụng pure DOM (`createElement`, `textContent`) trong `view.js`, tuyệt đối không dùng `innerHTML` khi hiển thị dữ liệu người dùng.
(commit 428ba4a)

## Phiên 2: Thiết kế kiến trúc ghép nối Mediator Pattern (Prompt 2)
**Tôi hỏi:** Làm sao để ghép 3 phần (form nhập liệu, kiểm tra luật, lưu localStorage) mà các module không bị dính chặt vào nhau (tight coupling)?
**Agent trả lời:** Áp dụng Mediator Pattern thông qua file `main.js`. Các module `form.js`, `rules.js`, `storage.js`, `view.js` không import chéo nhau. `main.js` đứng ở giữa nhận sự kiện từ form, gọi rules kiểm tra, gọi storage lưu và gọi view hiển thị.
**Lợi ích đã kiểm chứng:** Khi `form.js` thay đổi hàm khởi tạo hay `rules.js` chưa kịp merge, ta chỉ cần điều chỉnh adapter tại `main.js` mà không phải đụng vào code nội bộ của từng module.
(commit 436265a)

## Phiên 3: Xử lý lệch kiểu dữ liệu khi ghép thực tế (Prompt 3)
**Tôi hỏi:** form.js gửi `{ tenSV, mssv, ... }` trong khi rules.js cần các tham số rời và chỉ trả về boolean `{ trung, trungVoi }`, ghép thế nào để báo lỗi đẹp cho người dùng?
**Agent trả lời:** Trong hàm `xuLyDatPhong`, `main.js` đóng vai trò Adapter: bóc tách `gioBatDau`, `gioKetThuc` gọi `kiemTraHopLeThoiGian`, sau đó truyền object và danh sách vào `kiemTraTrungGio`. Nếu phát hiện trùng, `main.js` format câu thông báo chi tiết chứa mã phòng và mã phiếu trùng rồi gửi đến `hienBannerLoi` và `hienThiThongBaoForm`.
**Ghi nhận:** Đã ghi lại sự lệch kiểu này vào `docs/hoi-cuu-tuan3.md` theo yêu cầu mục C2 của hướng dẫn TH2.

## Kết quả kiểm thử ghép luồng (E2E)

| Kịch bản kiểm thử | Thao tác | Kết quả kỳ vọng | Thực tế | Đạt |
|---|---|---|---|:---:|
| 1. Đặt phòng hợp lệ | Điền đúng thông tin, bấm Đặt phòng | Hiện banner xanh, có mã PDC-xxx, phiếu xuất hiện trong lịch sử | Form reset, banner xanh, phiếu mới nhất lên đầu | ✓ |
| 2. Trùng giờ cùng phòng (BR-01) | Đặt lại đúng phòng & khung giờ vừa đặt | Báo lỗi trùng giờ, không lưu thêm phiếu | Hiện banner đỏ và lỗi form: "Phòng ... đã có người đặt..." | ✓ |
| 3. Kề giờ không trùng | Đặt phòng tiếp theo khung giờ vừa đặt (ví dụ 10:00–12:00 sau ca 08:00–10:00) | Lưu thành công | Đặt thành công, xuất hiện 2 phiếu | ✓ |
| 4. F5 tải lại trang | Bấm F5 trên trình duyệt | Lịch sử phiếu không bị mất (dữ liệu còn trong localStorage) | Danh sách hiển thị đầy đủ các phiếu đã lưu | ✓ |

## Điều học được ở TH2 (cụ thể về hệ thống):
Mediator Pattern giúp phân tách ranh giới rõ ràng giữa 4 người: người làm form không cần biết lưu ở đâu, người làm luật chỉ viết hàm thuần JS không dính DOM, người làm storage chỉ quản lý CRUD, và người làm view chỉ lo hiển thị. Khi tích hợp, toàn bộ xung đột về kiểu dữ liệu đều được giải quyết tập trung tại `main.js`.
