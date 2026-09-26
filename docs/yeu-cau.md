# Yêu cầu — [tên hệ thống]

*Mốc M1. Script CI kiểm: ≥ 3 tác nhân, ≥ 6 FR, ≥ 3 NFR, ≥ 1 BR, và **mỗi dòng NFR phải có ít nhất một con số kèm đơn vị**. Nhớ giữ đúng tiền tố `FR-`, `NFR-`, `BR-` ở cột đầu, CI đếm theo đó.*

## Tác nhân

| Tác nhân | Là ai | Muốn gì từ hệ thống |
|---|---|---|
| | | |
| | | |
| | | |

## Yêu cầu chức năng

Viết dạng: *Là [tác nhân], tôi muốn [làm gì] để [đạt gì]*. Đánh số để sau này còn truy vết.

| # | Tác nhân | Muốn | Để |
|---|---|---|---|
| FR-01 | | | |
| FR-02 | | | |

## Yêu cầu phi chức năng

**Mỗi dòng phải có con số.** Viết "nhanh", "ổn định", "an toàn" thì CI trả lại.

Cách viết: *[Chỉ số] phải [ngưỡng] khi [điều kiện đo]*. Ví dụ:
- Thời gian phản hồi trang đặt chỗ ≤ 500 ms tại phân vị 95, khi 50 người dùng đồng thời.
- Hệ thống chịu được 200 yêu cầu/giây trong 10 phút giờ cao điểm.
- Dữ liệu đặt chỗ không mất khi máy chủ khởi động lại (bền vững 100%).

| # | Chỉ số | Ngưỡng | Điều kiện đo | Ảnh hưởng tới thiết kế nào |
|---|---|---|---|---|
| NFR-01 | | | | |
| NFR-02 | | | | |
| NFR-03 | | | | |

## Ràng buộc nghiệp vụ — điều KHÔNG được phép xảy ra

| # | Ràng buộc | Ai chịu trách nhiệm bảo vệ (lớp nào, điền ở M3) |
|---|---|---|
| BR-01 | | |
| BR-02 | | |

## Câu hỏi còn mở cho khách hàng

- 
