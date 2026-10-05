# Nhật ký đo trùng lặp mã nguồn — Nhóm 01

> Đo bằng công cụ `jscpd` trên thư mục `src/`:
> Lệnh chạy: `npx -y jscpd src --min-tokens 30 --reporters console`

---

## 1. Lần đo 1: Tuần 3 (Thực hành 2 — Xây dựng luồng chính)

- **Thời điểm đo:** 05/10/2026
- **Phạm vi phân tích:** 6 tệp trong `src/` (`index.html`, `form.js`, `rules.js`, `storage.js`, `view.js`, `main.js`).
- **Kết quả 3 con số:**
  - **Tổng số dòng:** 748 dòng (521 dòng JavaScript, 227 dòng Markup)
  - **Số khối trùng:** 0 khối
  - **Tỷ lệ trùng lặp:** 0.00%

### Phân tích khối trùng:
- Công cụ không tìm thấy khối mã trùng lặp nào (`Found 0 clones`).
- **Nguyên nhân:** Nhóm đã phân chia ranh giới trách nhiệm rất rõ ràng ngay từ đầu theo 4 module độc lập:
  - `form.js` chỉ dựng DOM nhập liệu và bắt sự kiện.
  - `rules.js` chỉ chứa pure functions kiểm tra luật thời gian.
  - `storage.js` độc quyền truy xuất `localStorage`.
  - `view.js` độc quyền render thông báo và danh sách.
  - `main.js` điều phối trung gian, không viết lại logic của module con.

---

## 2. Lần đo 2: Tuần 13 (Mốc M5 — Bàn giao hệ thống)

*(Sẽ tiến hành đo lại ở Tuần 13 và so sánh mức độ biến động trùng lặp sau khi mở rộng thêm các luồng nghiệp vụ ở Vòng 2 & 3).*
- Tổng số dòng: *(chờ đo)*
- Số khối trùng: *(chờ đo)*
- Tỷ lệ trùng lặp: *(chờ đo)* %
