# AI-log TH2 — Đạt · ph3-luu-doc

## Phiên 1: Hỏi khái niệm thiết kế storage (Prompt 1)
**Tôi hỏi:** Repository Pattern giúp đổi storage không sửa code khác?
**Agent trả lời:** Giải thích Repository Pattern + đề xuất dùng class
  với interface TypeScript.
**Tôi quyết định KHÁC:** Dùng module functions (export function thay vì
  class) vì nhóm dùng Vanilla JS thuần, không có TypeScript,
  OOP phức tạp hóa vô ích ở giai đoạn này.
  Quyết định này có đánh đổi: mất type safety, nhưng đơn giản hơn.
  (commit 45384eb)

## Phiên 2: Viết 3 hàm storage (Prompt 2)
**Tôi hỏi:** Viết module storage.js với 3 hàm (layTatCaPhieu, luuPhieu, xoaPhieu) dùng ES module export, key "se100_phieu_dat", tự sinh maPhieu "PDC-" + Date.now().
**Agent trả lời:** Viết module hoàn chỉnh và giải thích tại sao cần JSON.stringify/JSON.parse khi thao tác localStorage.
**Điều quan trọng học được:** localStorage lưu STRING, không lưu object.
  JSON.stringify/parse là cầu nối bắt buộc. Đây chính là lý do khi đổi
  sang Supabase (lưu object thật), thay đổi ở đây là cần thiết và hợp lý.
  (commit a63ed9d)

## Phiên 3: Hỏi về JSON.parse(null) và corrupted data (Prompt 3)
**Tôi hỏi:** getItem trả về null → JSON.parse(null) ra gì? Corrupted data xử lý sao?
**Agent trả lời:** JSON.parse(null) = null, không ném lỗi. Corrupted data
  ném SyntaxError → cần try-catch.
**Quyết định:** Reset về [] thay vì propagate lỗi lên, vì demo tuần 4
  ưu tiên ứng dụng không crash. Chấp nhận mất dữ liệu cũ khi bị corrupted.
  (commit 16db774)

## Điều học được ở TH2 (cụ thể về hệ thống):
localStorage lưu string nên JSON.parse(null) không ném lỗi nhưng JSON.parse
của data bị corrupt thì ném lỗi — hai trường hợp "không có data" cần xử lý khác nhau.
