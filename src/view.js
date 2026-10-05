// src/view.js
// Phần 4 — Màn hình kết quả: Banner thông báo và danh sách phiếu đặt phòng.
//
// [Câu 1 trước commit]: Hiển thị banner thành công/lỗi và render danh sách phiếu
//   đã đặt dưới dạng thẻ card, sử dụng thuần DOM API (createElement, textContent)
//   để bảo vệ hệ thống trước tấn công XSS từ dữ liệu người dùng nhập.
//
// [Câu 2 trước commit]: Xoá file này -> Người dùng đặt phòng xong không thấy thông báo
//   kết quả và không thấy danh sách phiếu -> Mắt xích cuối cùng của luồng lõi bị đứt.
//
// [Câu 3 trước commit]: Không chỗ nào khác trong src/ làm nhiệm vụ hiển thị kết quả và danh sách phiếu. ✓

function layContainerBanner(targetEl = null) {
  if (targetEl) return targetEl;
  let banner = document.getElementById('banner') || document.getElementById('thong-bao');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'banner';
    const formContainer = document.getElementById('form-container');
    if (formContainer && formContainer.parentNode) {
      formContainer.parentNode.insertBefore(banner, formContainer);
    } else {
      document.body.prepend(banner);
    }
  }
  return banner;
}

function layContainerDanhSach(targetEl = null) {
  if (targetEl) return targetEl;
  let container = document.getElementById('lich-su') ||
                  document.getElementById('danh-sach-phieu') ||
                  document.getElementById('danhSachPhieu');
  if (!container) {
    container = document.createElement('section');
    container.id = 'lich-su';
    document.body.appendChild(container);
  }
  return container;
}

export function hienBannerThanhCong(phieu, targetEl = null) {
  const container = layContainerBanner(targetEl);

  const hopThongBao = document.createElement('div');
  hopThongBao.className = 'banner banner-thanh-cong';

  const maPhieu = typeof phieu === 'object' && phieu !== null
    ? (phieu.maPhieu ?? phieu.id ?? '')
    : String(phieu ?? '');

  hopThongBao.textContent = `✓ Đặt phòng thành công! Mã phiếu: ${maPhieu}`;

  container.replaceChildren(hopThongBao);
}

export function hienBannerLoi(lyDo, targetEl = null) {
  const container = layContainerBanner(targetEl);

  const hopThongBao = document.createElement('div');
  hopThongBao.className = 'banner banner-loi';

  const thongDiep = typeof lyDo === 'object' && lyDo !== null && lyDo.message
    ? lyDo.message
    : String(lyDo ?? 'Đã xảy ra lỗi không xác định.');

  hopThongBao.textContent = `Đặt phòng thất bại: ${thongDiep}`;

  container.replaceChildren(hopThongBao);
}

export function hienDanhSachPhieu(mangPhieu, targetEl = null) {
  const container = layContainerDanhSach(targetEl);

  if (!Array.isArray(mangPhieu) || mangPhieu.length === 0) {
    container.replaceChildren();
    return;
  }

  const tieuDe = document.createElement('h2');
  tieuDe.textContent = 'Phiếu đã đặt';

  const fragment = document.createDocumentFragment();
  fragment.appendChild(tieuDe);

  // Hiển thị phiếu mới nhất ở trên cùng
  const danhSachHienThi = mangPhieu.slice().reverse();

  for (const phieu of danhSachHienThi) {
    const item = document.createElement('div');
    item.className = 'phieu-item';

    // Dòng 1: Mã phiếu và trạng thái
    const dongDau = document.createElement('div');

    const spanMa = document.createElement('span');
    spanMa.className = 'ma';
    spanMa.textContent = phieu.maPhieu ?? phieu.id ?? '';

    const spanTrangThai = document.createElement('span');
    spanTrangThai.className = 'trang-thai';
    spanTrangThai.textContent = phieu.trangThai ?? phieu.trangThaiPhieu ?? 'ChoDuyet';

    dongDau.appendChild(spanMa);
    dongDau.appendChild(document.createTextNode(' '));
    dongDau.appendChild(spanTrangThai);
    item.appendChild(dongDau);

    // Dòng 2: Họ tên (MSSV) · Phòng
    const dongGiua = document.createElement('div');
    const bTen = document.createElement('b');
    bTen.textContent = phieu.tenSV ?? phieu.nguoiDat ?? 'Sinh viên';
    dongGiua.appendChild(bTen);

    const mssvStr = phieu.mssv ? ` (${phieu.mssv})` : '';
    const phongStr = ` · Phòng ${phieu.maPhong ?? phieu.tenPhong ?? phieu.phong ?? ''}`;
    dongGiua.appendChild(document.createTextNode(mssvStr + phongStr));
    item.appendChild(dongGiua);

    // Dòng 3: Ngày và Khung giờ
    const dongCuoi = document.createElement('div');
    const ngay = phieu.ngay ?? '';
    const gioBatDau = phieu.gioBatDau ?? phieu.thoiGianBatDau ?? '';
    const gioKetThuc = phieu.gioKetThuc ?? phieu.thoiGianKetThuc ?? '';
    const gioStr = (gioBatDau && gioKetThuc) ? `${gioBatDau} – ${gioKetThuc}` : (gioBatDau || gioKetThuc);
    const thoiGianStr = [ngay ? `Ngày ${ngay}` : '', gioStr].filter(Boolean).join('  |  ');

    dongCuoi.textContent = thoiGianStr;
    item.appendChild(dongCuoi);

    fragment.appendChild(item);
  }

  container.replaceChildren(fragment);
}
