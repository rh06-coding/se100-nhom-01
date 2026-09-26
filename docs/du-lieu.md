# Thiết kế dữ liệu — mốc M4

## Quyết định: quan hệ hay tài liệu?

Chọn: **quan hệ (SQL)** / **tài liệu (NoSQL)** / **cả hai**. Viết một đoạn nói vì sao chọn thế, kể cả cái mất mà nhóm chấp nhận. Bản đầy đủ ghi thành `adr/000x-chon-csdl.md`.

## Lược đồ

Ánh xạ từ `diagrams/class.mmd`. Mỗi lớp ghi rõ: bảng hay collection nào, khoá gì, quan hệ với ai.

```
erDiagram
  PHONG ||--o{ LUOT_DAT : "có"
  SINH_VIEN ||--o{ LUOT_DAT : "tạo"
```

## Bất biến nào được bảo vệ ở tầng dữ liệu?

| Ràng buộc (BR-) | Bảo vệ bằng | Bảo vệ ở tầng nào |
|---|---|---|
| BR-01 | UNIQUE / CHECK / transaction / chỉ trong mã | dữ liệu / miền / cả hai |

## Di trú

Sau này đổi lược đồ thì làm thế nào? Một câu thôi: dùng công cụ migration hay sửa tay.
