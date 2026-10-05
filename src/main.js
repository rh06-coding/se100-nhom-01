import { khoiTaoForm, hienThiThongBaoForm } from './form.js';
import { layTatCaPhieu, luuPhieu } from './storage.js';
import { hienBannerThanhCong, hienBannerLoi, hienDanhSachPhieu } from './view.js';

// Kiểm tra trùng giờ sơ bộ thực thi BR-01 (không hai phiếu trùng khung giờ cho cùng một phòng)
function kiemTraTrung(phieuMoi, danhSachPhieu) {
  const cungPhongNgay = (danhSachPhieu || []).filter(
    p => p.maPhong === phieuMoi.maPhong && p.ngay === phieuMoi.ngay
  );

  for (const p of cungPhongNgay) {
    const batDauDaCo = p.gioBatDau ?? p.thoiGianBatDau ?? '';
    const ketThucDaCo = p.gioKetThuc ?? p.thoiGianKetThuc ?? '';
    if (phieuMoi.gioBatDau < ketThucDaCo && batDauDaCo < phieuMoi.gioKetThuc) {
      return { trung: true, trungVoi: p };
    }
  }
  return { trung: false, trungVoi: null };
}

function xuLyDatPhong(duLieuForm, formContainer) {
  const danhSachHienTai = layTatCaPhieu() || [];

  // Kiểm tra trùng giờ theo ràng buộc cốt lõi BR-01
  const ketQuaTrung = kiemTraTrung(duLieuForm, danhSachHienTai);
  if (ketQuaTrung.trung) {
    const lyDo = `Phòng ${duLieuForm.maPhong} đã có người đặt trong khung giờ này (trùng phiếu ${ketQuaTrung.trungVoi.maPhieu}).`;
    hienBannerLoi(lyDo);
    if (formContainer) {
      hienThiThongBaoForm(formContainer, lyDo, 'loi');
    }
    return;
  }

  try {
    const phieuDaLuu = luuPhieu(duLieuForm);
    hienBannerThanhCong(phieuDaLuu);
    if (formContainer) {
      hienThiThongBaoForm(
        formContainer,
        `✓ Đặt phòng thành công! Mã phiếu: ${phieuDaLuu.maPhieu}`,
        'thanh-cong'
      );
    }
    hienDanhSachPhieu(layTatCaPhieu());
  } catch (err) {
    const thongBaoLoi = 'Lỗi lưu phiếu: ' + err.message;
    hienBannerLoi(thongBaoLoi);
    if (formContainer) {
      hienThiThongBaoForm(formContainer, thongBaoLoi, 'loi');
    }
  }
}

function khoiTao() {
  const formContainer = document.getElementById('form-container');
  if (formContainer) {
    khoiTaoForm(formContainer, (duLieu) => xuLyDatPhong(duLieu, formContainer));
  }

  // Tải lại danh sách phiếu đã lưu khi khởi tạo trang
  hienDanhSachPhieu(layTatCaPhieu());
}

// Chạy khởi tạo ứng dụng
khoiTao();

