import { langNgheSubmit, resetForm } from './form.js';
import { kiemTraHopLe } from './rules.js';
import { layDanhSachPhieu, luuPhieu } from './storage.js';
import { hienBannerThanhCong, hienBannerLoi, hienDanhSachPhieu } from './view.js';

function xuLyDatPhong(duLieuForm) {
  const danhSachHienTai = layDanhSachPhieu() || [];

  const ketQuaKiemTra = kiemTraHopLe(duLieuForm, danhSachHienTai);
  if (!ketQuaKiemTra.hopLe) {
    hienBannerLoi(ketQuaKiemTra.lyDo);
    return;
  }

  const phieuMoi = {
    maPhieu: `P-${Date.now()}`,
    tenPhong: duLieuForm.tenPhong,
    nguoiDat: duLieuForm.nguoiDat,
    thoiGianBatDau: duLieuForm.thoiGianBatDau,
    thoiGianKetThuc: duLieuForm.thoiGianKetThuc,
    trangThaiPhieu: 'Chờ duyệt'
  };

  luuPhieu(phieuMoi);

  hienBannerThanhCong(phieuMoi);
  hienDanhSachPhieu(layDanhSachPhieu());
  resetForm();
}

function khoiTao() {
  const danhSach = layDanhSachPhieu() || [];
  hienDanhSachPhieu(danhSach);
  langNgheSubmit(xuLyDatPhong);
}

khoiTao();
