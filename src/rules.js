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

/**
 * Kiểm phiếu mới có trùng giờ với phiếu đã lưu (BR-01).
 * Quy ước: kề nhau (A_ket === B_bat) KHÔNG tính là trùng.
 *
 * @param {{ maPhong: string, ngay: string, gioBatDau: string, gioKetThuc: string }} phieuMoi
 * @param {Array} danhSachPhieu - mảng phiếu đã lưu từ storage.js
 * @returns {{ trung: boolean, trungVoi: object | null }}
 *
 * [Câu 2 trước commit]: Xoá hàm này → BR-01 không được thực thi,
 * hai phiếu trùng giờ cùng phòng có thể tồn tại — vi phạm ràng buộc cốt lõi.
 */
export function kiemTraTrungGio(phieuMoi, danhSachPhieu) {
  // Lọc chỉ xét phiếu cùng phòng VÀ cùng ngày
  const cuaCungPhongNgay = danhSachPhieu.filter(
    p => p.maPhong === phieuMoi.maPhong && p.ngay === phieuMoi.ngay
  );

  for (const p of cuaCungPhongNgay) {
    // Hai khung giờ [A_bat, A_ket] và [B_bat, B_ket] trùng khi:
    //   A_bat < B_ket  VÀ  B_bat < A_ket
    // Dấu < (không phải <=) nên kề nhau KHÔNG bị tính là trùng.
    const trung =
      phieuMoi.gioBatDau < p.gioKetThuc &&
      p.gioBatDau < phieuMoi.gioKetThuc;

    if (trung) {
      return { trung: true, trungVoi: p };
    }
  }

  // Mảng rỗng hoặc không có phiếu trùng → trả về không trùng
  return { trung: false, trungVoi: null };
}
