# AI-log TH2 — Diễn · ph2-luat

## Phiên 1: Hỏi khái niệm overlap (Prompt 1)
**Tôi hỏi:** Hai khung giờ overlap khi nào? Kề nhau có tính là trùng không?
**Agent trả lời:** Hai khung giờ [A_bat, A_ket] và [B_bat, B_ket] chồng lấn khi và chỉ khi A_bat < B_ket và B_bat < A_ket. Về trường hợp kề nhau (A_ket = B_bat), tùy quy ước nghiệp vụ mà tính là trùng (dùng <=) hay không trùng (dùng <). Trong quản lý phòng học, học ca sau nối tiếp ca trước là hoàn toàn bình thường nên quy ước kề nhau không tính là trùng.
**Điều tôi không ngờ:** Agent đề xuất dùng Date object để parse HH:mm.
  Tôi hỏi lại: "Nếu chỉ so sánh string HH:mm trực tiếp có hoạt động không?"
  → Agent giải thích được, và cách này đơn giản hơn nhiều.
  Đây là lần tôi tự phát hiện agent đề xuất phức tạp hơn cần thiết.

## Phiên 2: Viết kiemTraHopLeThoiGian (Prompt 2)
**Tôi hỏi:** Viết hàm kiemTraHopLeThoiGian(gioBatDau, gioKetThuc) trong file rules.js nhận chuỗi HH:mm 24h, trả về { hopLe, lyDo }, dùng ES module, giải thích so sánh string.
**Agent trả lời:** Viết hàm kiểm tra `gioKetThuc <= gioBatDau` và giải thích về so sánh lexicographic (chuỗi HH:mm cố định 2 chữ số thì thứ tự từ điển trùng với thứ tự thời gian).
**Tôi sửa so với đề xuất:** Đổi tên tham số startTime/endTime sang gioBatDau/gioKetThuc theo Data Contract của nhóm.
(commit 199cd06)

## Phiên 3: Hỏi về mảng rỗng và viết kiemTraTrungGio (Prompt 3 & 4)
**Tôi hỏi:** Viết hàm kiemTraTrungGio(phieuMoi, danhSachPhieu) thực thi BR-01 với quy ước kề nhau không trùng. Nếu danhSachPhieu = [] thì vòng lặp for...of xử lý thế nào? Hàm trả về gì?
**Agent trả lời:** for...of trên mảng rỗng không chạy lần lặp nào, hàm tự động đi xuống cuối và trả về { trung: false, trungVoi: null } — hoàn toàn đúng hành vi mong muốn.
**Kết luận:** Không cần xử lý riêng (if-else rườm rà) cho trường hợp mảng rỗng.
(commit 0967528)

## Kết quả kiểm thử thủ công

| Test case | Input | Kỳ vọng | Thực tế | ✓/✗ |
|---|---|---|---|:---:|
| 1 - trùng chồng | [08:00–10:00] vs [09:00–11:00] cùng phòng ngày | trùng | { trung: true, trungVoi: object } | ✓ |
| 2 - kề nhau | [08:00–10:00] vs [10:00–12:00] cùng phòng ngày | không trùng | { trung: false, trungVoi: null } | ✓ |
| 3 - trước đó | [08:00–10:00] vs [06:00–08:00] cùng phòng ngày | không trùng | { trung: false, trungVoi: null } | ✓ |
| 4 - giống hệt | [08:00–10:00] vs [08:00–10:00] cùng phòng ngày | trùng | { trung: true, trungVoi: object } | ✓ |
| 5 - giờ sai | gioBatDau="10:00", gioKetThuc="08:00" | hopLe=false | { hopLe: false, lyDo: "Giờ kết thúc..." } | ✓ |
| 6 - khác phòng | [08:00–10:00] A.101 vs [08:00–10:00] A.102 | không trùng | { trung: false, trungVoi: null } | ✓ |

## Điều học được ở TH2 (cụ thể về hệ thống):
Định dạng thời gian 24h chuẩn "HH:mm" có độ dài cố định nên thứ tự từ điển (lexicographical comparison) trùng khớp hoàn toàn với thứ tự thời gian thực tế, cho phép kiểm tra hợp lệ và trùng giờ bằng các phép so sánh chuỗi đơn giản mà không cần parse Date object hay ép kiểu sang phút.
