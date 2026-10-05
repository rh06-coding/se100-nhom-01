# Hệ thống Đặt chỗ Phòng tự học — SE100 · Nhóm 01

Hệ thống hỗ trợ sinh viên trong khoa chủ động đăng ký sử dụng các phòng tự học theo từng khung giờ học tập và nghiên cứu.
Giáo vụ phụ trách quản lý danh mục phòng, xét duyệt hoặc từ chối các yêu cầu đặt phòng để đảm bảo phân bổ hợp lý, đúng đối tượng và không chồng chéo.
Bảo vệ phụ trách xác nhận sinh viên có mặt nhận phòng đúng giờ và ghi nhận thời điểm trả phòng thực tế để cập nhật trạng thái phòng.
Quy trình đặt chỗ vận hành nghiêm ngặt qua các trạng thái: Chờ duyệt → Đã duyệt → Đã nhận phòng → Đã trả phòng (hoặc Đã hủy).
Ràng buộc cốt lõi: Không tồn tại hai lượt đặt trùng khung giờ cho cùng một phòng; nếu quá 15 phút kể từ giờ bắt đầu mà sinh viên chưa đến nhận phòng thì hệ thống tự động chuyển trạng thái Đã hủy và giải phóng phòng.

## Thành viên

| STT | Họ và tên | MSSV | GitHub | Chủ trì mốc |
|:---:|---|:---:|---|---|
| 1 | Phạm Văn Đức Duy | 24520395 | @Wisee24 | M1: Yêu cầu |
| 2 | Nguyễn Văn Diễn | 24520300 | @VanDien2006 | M2: Mô hình hoá |
| 3 | Võ Thành Đạt | 24520296 | @vodat102 | M3–M4: Thiết kế |
| 4 | Lê Hoàng | 24520538 | @rh06-coding | M0 & M5: Dựng môi trường & Giao hàng |

## URL

- Bản chạy: https://se100-nhom-01.pages.dev
- Pipeline: xem tab Actions

## Phân công luồng nghiệp vụ

Hệ thống được chia thành 4 luồng nghiệp vụ chính theo chiều dọc, mỗi thành viên phụ trách một nhánh tương ứng:

| Luồng | Người phụ trách | Nhánh | Trách nhiệm chính |
|---|---|---|---|
| **Luồng 1: Đặt phòng** | Phạm Văn Đức Duy | `ph1-man-hinh` | Form nhập liệu (`src/form.js`), validation UI, thu thập thông tin đặt |
| **Luồng 2: Duyệt phòng** | Nguyễn Văn Diễn | `ph2-luat` | Luật nghiệp vụ thời gian (`src/rules.js`), bảo vệ ràng buộc không trùng giờ (BR-01) |
| **Luồng 3: Nhận & Trả phòng** | Võ Thành Đạt | `ph3-luu-doc` | Quản lý lưu trữ & đọc dữ liệu (`src/storage.js`), bảo vệ BR-02, BR-03 |
| **Luồng 4: Quản trị & Tích hợp** | Lê Hoàng | `ph4-ket-qua` | Màn hình kết quả & danh sách (`src/view.js`), điều phối tích hợp (`src/main.js`), CI/CD |

## Công nghệ sử dụng

- **Giao diện & Logic:** HTML5, Vanilla CSS (Dark Mode), Vanilla JavaScript thuần (ES Modules: `import`/`export`), không dùng thư viện ngoài.
- **Lưu trữ dữ liệu:**
  - Vòng 1 (TH2): `localStorage` để chạy độc lập và demo luồng lõi nhanh chóng.
  - Vòng 2 (M4): Nâng cấp sang `Supabase` lưu trữ tập trung.
- **Triển khai & Tự động hoá:** Cloudflare Pages, GitHub Actions (`kiem-moc.yml`).

## Hướng dẫn chạy thử nghiệm cục bộ

Do mã nguồn ứng dụng sử dụng cơ chế JavaScript ES Modules (`type="module"`), trình duyệt yêu cầu chạy qua một máy chủ tĩnh (static web server) để tránh lỗi bảo mật CORS:

1. **Dùng Python:**
   ```bash
   python -m http.server 8000 -d src
   ```
   Mở trình duyệt tại: `http://localhost:8000`

2. **Dùng Node.js:**
   ```bash
   npx serve src
   ```

3. **Dùng VS Code Extension:** Nhấp chuột phải vào `src/index.html` và chọn **Open with Live Server**.

## Cấu trúc repo

```
docs/         yêu cầu, đặc tả use case, phân tích tác động
diagrams/     sơ đồ Mermaid (.mmd) — use case, lớp, tuần tự, trạng thái, C4
adr/          quyết định kiến trúc, mỗi quyết định một tệp
phan-tu/      bản phản tư M0–M5 và bảng phản hồi cáo buộc
ai-log/       bản ghi hội thoại với agent, theo mốc
src/          mã nguồn
.github/      workflow kiểm mốc — đừng sửa
AGENTS.md     ràng buộc kiến trúc cho agent đọc — viết ở M4
```

## Mốc

| Mốc | Hạn | Nộp gì | CI kiểm thêm |
|---|---|---|---|
| M0 | CN tuần 2 | README, đề tài, `docs/cau-hoi-khach-hang.md` (≥ 3 câu) | 4 người có commit |
| V1 | CN tuần 4 | Hệ thống chạy, `docs/hoi-cuu-vong1.md`, ai-log | Giảng viên kiểm tay, không tính điểm |
| M1 | CN tuần 5 | `docs/yeu-cau.md` | ≥ 3 tác nhân, ≥ 6 FR, ≥ 3 NFR có số, ≥ 1 BR |
| M2 | CN tuần 7 | `diagrams/use-case.mmd` (≥ 5 UC), `docs/dac-ta-UC-*.md` ×3, `diagrams/seq-*.mmd` ×2 | Mermaid parse được |
| M3 | CN tuần 9 | `diagrams/class.mmd` (≥ 5 lớp), `diagrams/state.mmd`, `docs/tu-danh-gia-M3.md` | Đối chiếu chéo lớp ↔ sequence; mọi lớp có trong docs/ |
| M4 | CN tuần 10 | `diagrams/c4-context.mmd`, `c4-container.mmd`, `docs/du-lieu.md`, `adr/0001-*.md`, `AGENTS.md` | ADR có ≥ 2 phương án; AGENTS.md hết comment mẫu |
| M5 | CN tuần 13 | Pipeline riêng xanh, URL sống, `docs/tac-dong-vong3.md`, `docs/trung-lap.md` có 2 lần đo | URL trả 200 |

Mốc nào cũng kèm `phan-tu/Mn.md` (M0 ≥ 40 từ, còn lại ≥ 120 từ, có mã commit) và một tệp trong `ai-log/`. Từ M2 thêm `phan-tu/Mn-phan-hoi.md`.

## Cách nộp mốc

1. Tạo nhánh `moc/Mn` rồi làm việc trên đó.
2. Mở Pull Request vào `main`, tiêu đề `Mn — [tên nhóm]`.
3. Đợi workflow **Kiểm mốc** chạy. Đỏ thì đọc log, sửa, push lại.
4. Xanh thì merge. Thời điểm merge là thời điểm nộp.
