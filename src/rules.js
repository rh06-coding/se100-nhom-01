// src/rules.js
// Mục đích: Chứa toàn bộ luật nghiệp vụ về thời gian đặt phòng.
// KHÔNG đụng tới DOM (không biết HTML tồn tại).
// KHÔNG import storage.js (nhận dữ liệu qua tham số).
// Hàm thuần JS: cùng input → cùng output (pure function).

/**
 * Kiểm giờ kết thúc phải SAU giờ bắt đầu.
 *
 * @param {string} gioBatDau  - "HH:mm" (24h), ví dụ "08:00"
 * @param {string} gioKetThuc - "HH:mm" (24h), ví dụ "10:00"
 * @returns {{ hopLe: boolean, lyDo: string }}
 *
 * [Câu 2 trước commit]: Xoá hàm này → main.js không thể kiểm nghiệp vụ
 * giờ trước khi lưu phiếu. Phiếu 10:00–08:00 sẽ được lưu và gây lỗi.
 *
 * Lý do so sánh string hoạt động: HH:mm là định dạng cố định 2 chữ số,
 * nên "08:00" < "10:00" về lexicographic = đúng về giờ thực.
 */
export function kiemTraHopLeThoiGian(gioBatDau, gioKetThuc) {
  if (gioKetThuc <= gioBatDau) {
    return {
      hopLe: false,
      lyDo: `Giờ kết thúc (${gioKetThuc}) phải sau giờ bắt đầu (${gioBatDau})`
    };
  }
  return { hopLe: true, lyDo: '' };
}
