import { langNgheSubmit, resetForm } from './form.js';
import { kiemTraHopLe } from './rules.js';
import { layTatCaPhieu, luuPhieu } from './storage.js';
import { hienBannerThanhCong, hienBannerLoi, hienDanhSachPhieu } from './view.js';

function xuLyDatPhong(duLieuForm) {
  const danhSachHienTai = layTatCaPhieu() || [];

  const ketQuaKiemTra = kiemTraHopLe(duLieuForm, danhSachHienTai);
  if (!ketQuaKiemTra.hopLe) {
    hienBannerLoi(ketQuaKiemTra.lyDo);
    return;
  }

  const phieuDaLuu = luuPhieu(duLieuForm);

  hienBannerThanhCong(phieuDaLuu);
  hienDanhSachPhieu(layTatCaPhieu());
  resetForm();
}

function khoiTao() {
  const danhSach = layTatCaPhieu() || [];
  hienDanhSachPhieu(danhSach);
  langNgheSubmit(xuLyDatPhong);
}

khoiTao();
