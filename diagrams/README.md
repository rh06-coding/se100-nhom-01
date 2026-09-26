# Sơ đồ

Tất cả viết bằng **Mermaid**, đuôi `.mmd`. GitHub render trực tiếp khi mở tệp `.md` có khối ```mermaid. Còn CI thì đọc tệp `.mmd` thuần, nên ở đây **không** bọc trong ```mermaid.

## Tên tệp CI tìm

| Mốc | Tệp | Loại Mermaid |
|---|---|---|
| M2 | `use-case.mmd` | `flowchart` (Mermaid chưa có use case chuẩn, xem quy ước bên dưới) |
| M2 | `seq-*.mmd` (≥ 2 tệp) | `sequenceDiagram` |
| M3 | `class.mmd` | `classDiagram` |
| M3 | `state.mmd` | `stateDiagram-v2` |
| M4 | `c4-context.mmd`, `c4-container.mmd` | `C4Context`, `C4Container` |

## Quy ước use case bằng flowchart

```
flowchart LR
  SV([Sinh viên])
  GV([Giáo vụ])
  subgraph HT[Hệ thống đặt phòng]
    UC1(Đặt phòng)
    UC2(Duyệt đặt phòng)
    UC3(Xác thực)
  end
  SV --> UC1
  GV --> UC2
  UC1 -. include .-> UC3
```

Tác nhân dùng `([ ])`, use case dùng `( )`, include/extend dùng mũi tên đứt `-. include .->`.

## Quy ước để CI đối chiếu chéo được

- Tên lớp trong `class.mmd`: `class TenLop {`
- Tên lớp trong `seq-*.mmd`: `participant TenLop`, **dùng đúng tên lớp**, đừng đặt biệt danh, vì CI lấy hiệu hai tập tên.
- Phương thức gọi trong sequence: `A->>B: tenPhuongThuc(...)`. CI xem `tenPhuongThuc` có trong lớp `B` không.
- **Mỗi lớp trong `class.mmd` phải được nhắc tên, đúng chính tả, trong ít nhất một tệp ở `docs/`**, đặc tả use case hoặc `yeu-cau.md` đều được. Lớp không sinh ra từ yêu cầu nào thì CI báo.
- Tên lớp: chữ không dấu, số, gạch dưới. `class Phong` được; `class Phòng` không.

## Xem trước

VS Code thì cài extension "Markdown Preview Mermaid Support", hoặc dán thẳng vào `mermaid.live`.

Trước khi push, kiểm cú pháp ở máy mình: `npx -y @mermaid-js/mermaid-cli -i diagrams/class.mmd -o /tmp/x.svg`
