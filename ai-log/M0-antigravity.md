# Bản ghi hội thoại Agent — Mốc M0

- **Công cụ**: Google Antigravity
- **Thời gian**: 2026-09-26
- **Mục tiêu**: Thiết lập môi trường, khởi tạo cây thư mục từ repo mẫu, chuẩn bị và tinh chỉnh các tệp yêu cầu cho mốc M0 và Thực hành 1 (TH1).

## Nội dung tương tác chính
- Clone kho lưu trữ `https://github.com/rh06-coding/se100-nhom-01.git`.
- Đồng bộ toàn bộ các tệp cấu trúc chuẩn từ `repo-mau` (adr, ai-log, diagrams, docs, phan-tu, scripts, src, AGENTS.md, README.md).
- Thiết lập GitHub Actions workflow `.github/workflows/kiem-moc.yml` để chạy `python scripts/kiem_moc.py` tự động khi mở PR.
- Đơn giản hóa `src/index.html` về 4 dòng tĩnh tối giản theo hướng dẫn TH1 D1.
- Phân tích tài liệu đề tài `De_tai_Dat_cho_phong_tu_hoc.md`: trích xuất 5 use cases, 3 tác nhân, 5 trạng thái vòng đời phiếu đặt và 2 ràng buộc nghiệp vụ cốt lõi.
- Thiết kế và cập nhật sơ đồ lớp chuẩn 5 lớp (`SinhVien`, `PhongTuHoc`, `GiaoVu`, `BaoVe`, `PhieuDatPhong`) vào `diagrams/class.mmd` và bản xem trước `diagrams/xem.md`.
- Cập nhật danh sách 4 thành viên (Phạm Văn Đức Duy, Nguyễn Văn Diễn, Võ Thành Đạt, Lê Hoàng) vào `README.md`.
- Hoàn thiện bộ 3 câu hỏi nghiệp vụ phỏng vấn khách hàng tại `docs/cau-hoi-khach-hang.md`.
- Kiểm thử công cụ script kiểm mốc tự động tầng 1 `python scripts/kiem_moc.py M0`.
