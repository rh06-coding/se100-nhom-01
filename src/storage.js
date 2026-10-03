// src/storage.js
// Mục đích: TOÀN BỘ tương tác với storage (hiện là localStorage) đi qua đây.
// Vòng 2 — đổi sang Supabase: chỉ sửa file này, không đụng form.js/view.js.
// KHÔNG import gì từ file khác trong src/.

// Hằng số key — không viết cứng "se100_phieu_dat" ở nhiều chỗ
// [Câu 3 trước commit]: Không chỗ nào khác định nghĩa KEY này. ✓
const KEY = 'se100_phieu_dat';

/**
 * Đọc toàn bộ phiếu từ storage.
 * Trả về [] nếu chưa có dữ liệu.
 *
 * localStorage lưu STRING, không lưu object/array.
 * JSON.parse chuyển string → JavaScript value.
 * JSON.parse(null) → null (không ném lỗi), nên cần || []
 *
 * [Câu 2 trước commit]: Xoá hàm này → kiemTraTrungGio() không có
 * dữ liệu để kiểm tra → mọi lượt đặt đều qua (không thực thi BR-01).
 */
export function layTatCaPhieu() {
  const raw = localStorage.getItem(KEY);
  // getItem trả về null nếu key chưa tồn tại
  // JSON.parse(null) = null, nên dùng || [] để trả về mảng rỗng
  return JSON.parse(raw) || [];
}
