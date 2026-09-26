# Bản ghi hội thoại Agent — Mốc M0

- **Công cụ**: Google Antigravity
- **Thời gian**: 2026-09-26
- **Mục tiêu**: Thiết lập môi trường, khởi tạo cây thư mục từ repo mẫu, chuẩn bị các tệp yêu cầu cho mốc M0.

## Nội dung tương tác chính
- Clone kho lưu trữ `https://github.com/rh06-coding/se100-nhom-01.git`.
- Đồng bộ toàn bộ các tệp cấu trúc chuẩn từ `repo-mau` (adr, ai-log, diagrams, docs, phan-tu, scripts, src, AGENTS.md, README.md).
- Thiết lập GitHub Actions workflow `.github/workflows/kiem-moc.yml` để chạy `python scripts/kiem_moc.py` tự động khi mở PR.
- Tạo trang web tĩnh đầu tiên tại `src/index.html` cho Cloudflare Pages / Netlify.
- Khởi tạo sơ đồ nháp Mermaid tại `diagrams/class.mmd` và `diagrams/xem.md`.
- Kiểm thử công cụ script kiểm mốc tự động tầng 1.
