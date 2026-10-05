# Luồng lõi — Hệ thống Đặt chỗ Phòng tự học

## Luồng lõi (TH2)

Sinh viên điền form (tên, MSSV, phòng, ngày, giờ) → hệ thống kiểm tra không trùng khung giờ → lưu phiếu → hiện mã xác nhận.

## Cách lưu dữ liệu

`localStorage` — chọn vì nhanh nhất, đủ để chạy demo tuần 4 trên đúng máy đó.
Vòng 2 sẽ chuyển sang Supabase; lúc đó chỉ sửa `src/storage.js`.

## Phân công nhánh TH2

| Nhánh | Người | Đầu ra |
|---|---|---|
| `ph1-man-hinh` | Duy (Phạm Văn Đức Duy) | `src/form.js` — form nhập liệu |
| `ph2-luat` | Diễn (Nguyễn Văn Diễn) | `src/luat.js` — hàm kiểm tra không trùng giờ |
| `ph3-luu-doc` | Đạt (Võ Thành Đạt) | `src/storage.js` — ghi và đọc localStorage |
| `ph4-ket-qua-ghep` | Hoàng (Lê Hoàng) | `src/view.js` + ghép cả 3 phần |
