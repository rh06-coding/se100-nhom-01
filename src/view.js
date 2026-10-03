function layContainerBanner(targetEl = null) {
  if (targetEl) return targetEl;
  let banner = document.getElementById('banner') || document.getElementById('thong-bao');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'banner';
    document.body.prepend(banner);
  }
  return banner;
}

function layContainerDanhSach(targetEl = null) {
  if (targetEl) return targetEl;
  let container = document.getElementById('danh-sach-phieu') || document.getElementById('danhSachPhieu');
  if (!container) {
    container = document.createElement('div');
    container.id = 'danh-sach-phieu';
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

  hopThongBao.textContent = `Đặt phòng thành công! Mã phiếu: ${maPhieu}`;

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
    const thongBaoTrong = document.createElement('p');
    thongBaoTrong.className = 'danh-sach-trong';
    thongBaoTrong.textContent = 'Chưa có phiếu đặt phòng nào trong danh sách.';
    container.replaceChildren(thongBaoTrong);
    return;
  }

  const bang = document.createElement('table');
  bang.className = 'bang-danh-sach-phieu';

  const thead = document.createElement('thead');
  const hangTieuDe = document.createElement('tr');
  const cacCot = [
    'Mã phiếu',
    'Phòng',
    'Người đặt',
    'Bắt đầu',
    'Kết thúc',
    'Trạng thái'
  ];

  for (const tieuDe of cacCot) {
    const th = document.createElement('th');
    th.textContent = tieuDe;
    hangTieuDe.appendChild(th);
  }
  thead.appendChild(hangTieuDe);
  bang.appendChild(thead);

  const tbody = document.createElement('tbody');

  for (const phieu of mangPhieu) {
    const hangDuLieu = document.createElement('tr');

    const duLieuCot = [
      phieu.maPhieu ?? phieu.id ?? '',
      phieu.tenPhong ?? phieu.maPhong ?? phieu.phong ?? '',
      phieu.nguoiDat ?? phieu.sinhVien ?? phieu.maSV ?? '',
      phieu.thoiGianBatDau ?? phieu.batDau ?? '',
      phieu.thoiGianKetThuc ?? phieu.ketThuc ?? '',
      phieu.trangThaiPhieu ?? phieu.trangThai ?? ''
    ];

    for (const giaTri of duLieuCot) {
      const td = document.createElement('td');
      td.textContent = String(giaTri);
      hangDuLieu.appendChild(td);
    }

    tbody.appendChild(hangDuLieu);
  }

  bang.appendChild(tbody);
  container.replaceChildren(bang);
}
