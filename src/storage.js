// src/storage.js
// Mục đích: TOÀN BỘ tương tác với storage (hiện là localStorage) đi qua đây.
// Vòng 2 — đổi sang Supabase: chỉ sửa file này, không đụng form.js/view.js.
// KHÔNG import gì từ file khác trong src/.

// Hằng số key — không viết cứng "se100_phieu_dat" ở nhiều chỗ
// [Câu 3 trước commit]: Không chỗ nào khác định nghĩa KEY này. ✓
const KEY = 'se100_phieu_dat';

/**
 * Đọc toàn bộ phiếu từ storage.
 * Trả về [] nếu chưa có dữ liệu hoặc dữ liệu bị lỗi.
 *
 * localStorage lưu STRING, không lưu object/array.
 * JSON.parse chuyển string → JavaScript value.
 * JSON.parse(null) → null (không ném lỗi), nên cần || []
 *
 * [Câu 2 trước commit]: Xoá hàm này → kiemTraTrungGio() không có
 * dữ liệu để kiểm tra → mọi lượt đặt đều qua (không thực thi BR-01).
 */
export function layTatCaPhieu() {
  try {
    const raw = localStorage.getItem(KEY);
    // getItem trả về null nếu key chưa tồn tại
    // JSON.parse(null) = null, nên dùng || [] để trả về mảng rỗng
    return JSON.parse(raw) || [];
  } catch {
    // Xảy ra khi người dùng sửa tay localStorage → JSON sai định dạng
    // Quyết định: reset về [] thay vì crash, ghi cảnh báo để debug
    console.warn('[storage] Dữ liệu localStorage không hợp lệ, đã reset.');
    localStorage.removeItem(KEY);
    return [];
  }
}

/**
 * Lưu một phiếu mới. Bổ sung maPhieu, trangThai, thoiGianTao.
 * Trả về phiếu đã hoàn chỉnh (để main.js dùng hiện lên UI).
 *
 * JSON.stringify chuyển JavaScript value → string để localStorage lưu.
 *
 * [Câu 2 trước commit]: Xoá hàm này → phiếu không bao giờ được lưu,
 * F5 là mất toàn bộ → demo tuần 4 không qua được.
 */
export function luuPhieu(duLieuPhieu) {
  const tatCa = layTatCaPhieu();
  const phieuMoi = {
    ...duLieuPhieu,                           // spread dữ liệu từ form
    maPhieu:     'PDC-' + Date.now(),         // ID duy nhất (ms từ epoch)
    trangThai:   'ChoDuyet',                  // trạng thái ban đầu
    thoiGianTao: new Date().toISOString(),    // timestamp chuẩn ISO
  };
  tatCa.push(phieuMoi);
  localStorage.setItem(KEY, JSON.stringify(tatCa));
  return phieuMoi; // Trả về để main.js hiện xác nhận
}

/**
 * Xoá phiếu theo maPhieu.
 * Trả về true nếu tìm thấy và xoá, false nếu không tìm thấy.
 */
export function xoaPhieu(maPhieu) {
  const tatCa = layTatCaPhieu();
  const sau = tatCa.filter(p => p.maPhieu !== maPhieu);
  localStorage.setItem(KEY, JSON.stringify(sau));
  return sau.length < tatCa.length; // true nếu thực sự xoá được
}
