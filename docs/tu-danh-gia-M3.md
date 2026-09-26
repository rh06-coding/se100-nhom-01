# Tự đánh giá cohesion / coupling — mốc M3

*Điền sau bài tuần 9. CI chỉ kiểm tệp có tồn tại hay không, điểm thì nằm ở bản phản tư.*

Với **mỗi lớp** trong `diagrams/class.mmd`:

| Lớp | Trách nhiệm (một câu) | Phụ thuộc vào lớp nào | Lớp nào phụ thuộc vào nó | Tự chấm |
|---|---|---|---|---|
| | | | | ✅ một trách nhiệm / ⚠️ hai / ❌ nhiều |

## Ba câu

**Lớp nào đang gánh nhiều trách nhiệm nhất?** Nêu hai trách nhiệm đó. Định tách hay giữ, vì sao?

**Nếu đổi cơ sở dữ liệu, phải sửa những lớp nào?** Liệt kê ra. Nhiều hơn 2 lớp thì chỗ nào đang rò rỉ chi tiết lưu trữ?

**Nếu chạy hai agent song song, một sửa phần A, một sửa phần B, chúng có giẫm lên nhau không?** A và B là gì? Chỗ nào chung?
