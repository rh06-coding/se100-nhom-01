# AGENTS.md — ràng buộc kiến trúc cho agent

> Hầu hết agent lập trình đọc tự động tệp này trước khi làm việc trong repo. Trong đây ghi những gì agent **phải** tuân theo và **không được** làm. Viết ở mốc M4, sau khi đã có kiến trúc. Trước đó cứ để nguyên phần "Quy ước chung".
>
> Muốn thử xem nó có tác dụng không thì giao cho agent một việc đụng tới ranh giới module. Agent xuyên qua ranh giới nghĩa là ràng buộc viết chưa đủ rõ, sửa tệp này trước rồi hãy sửa mã.

## Quy ước chung (giữ nguyên)

- Sơ đồ viết bằng Mermaid trong `diagrams/`, không dùng ảnh.
- Mỗi quyết định kiến trúc một tệp trong `adr/`, theo mẫu `adr/0000-mau.md`.
- Không commit khoá API, mật khẩu, tệp `.env`.
- Đừng đụng vào `.github/workflows/`.
- Commit message tiếng Việt hoặc Anh, một dòng, nói **vì sao** chứ không phải cái gì.

## Kiến trúc (viết ở M4)

### Phân tầng
<!-- Ví dụ, thay bằng của nhóm:
- `src/domain/`: thực thể, giá trị, luật nghiệp vụ. KHÔNG import gì từ tầng khác.
- `src/app/`: use case, điều phối. Import domain. KHÔNG biết về HTTP hay CSDL.
- `src/infra/`: CSDL, gọi API ngoài, gửi thông báo. Hiện thực interface do domain/app định nghĩa.
- `src/ui/`: giao diện. Chỉ gọi app.
-->

### Bất biến nghiệp vụ — KHÔNG được vi phạm
<!-- Ví dụ:
- Một phòng không có hai lượt đặt trùng giờ. Kiểm tại `domain/DatCho.kiemTraTrung()`, không kiểm ở UI.
- Điểm thưởng không âm. Enforce trong constructor của `Diem`.
-->

### Ranh giới — agent KHÔNG được
<!-- Ví dụ:
- Không gọi CSDL trực tiếp từ `src/ui/` hay `src/domain/`.
- Không gọi `sendEmail`/`sendPush` từ bất kỳ đâu ngoài `infra/thong-bao/`.
- Không thêm thư viện mới mà không ghi ADR.
-->

### Khi thêm tính năng mới
<!-- Ví dụ:
1. Thêm use case vào `diagrams/use-case.mmd` trước.
2. Thêm lớp vào `diagrams/class.mmd`.
3. Rồi mới viết mã. Sơ đồ là nguồn sự thật.
-->

## Kiểm thử
<!-- Ví dụ:
- Mọi luật nghiệp vụ trong domain phải có test không cần CSDL.
- Chạy: `npm test` / `pytest`
-->
