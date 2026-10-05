// src/main.js
// Mục đích: Điều phối 4 module độc lập (form, rules, storage, view) theo Mediator Pattern.
// Từng module không biết nhau trực tiếp; toàn bộ luồng tích hợp đi qua file này.
//
// [Câu 1 trước commit]: Nhận dữ liệu từ form.js -> gọi rules.js kiểm tra hợp lệ
//   và trùng giờ -> gọi storage.js lưu phiếu -> gọi view.js hiển thị kết quả.
// [Câu 2 trước commit]: Xoá file này -> 4 module rời rạc không kết nối được ->
//   luồng chính đứt hoàn toàn, không thể demo được.
// [Câu 3 trước commit]: Không chỗ nào khác trong src/ làm nhiệm vụ điều phối luồng. ✓

import { khoiTaoForm, hienThiThongBaoForm } from './form.js';
import { kiemTraHopLeThoiGian, kiemTraTrungGio } from './rules.js';
import { layTatCaPhieu, luuPhieu } from './storage.js';
import { hienBannerThanhCong, hienBannerLoi, hienDanhSachPhieu } from './view.js';

function xuLyDatPhong(duLieuForm, formContainer) {
  // 1. Kiểm tra nghiệp vụ thời gian (giờ kết thúc phải sau giờ bắt đầu)
  const hopLeGio = kiemTraHopLeThoiGian(duLieuForm.gioBatDau, duLieuForm.gioKetThuc);
  if (!hopLeGio.hopLe) {
    hienBannerLoi(hopLeGio.lyDo);
    if (formContainer) {
      hienThiThongBaoForm(formContainer, hopLeGio.lyDo, 'loi');
    }
    return;
  }

  // 2. Kiểm tra ràng buộc trùng giờ BR-01 với các phiếu đã lưu
  const danhSachHienTai = layTatCaPhieu() || [];
  const ketQuaTrung = kiemTraTrungGio(duLieuForm, danhSachHienTai);
  if (ketQuaTrung.trung) {
    const maPhieuTrung = ketQuaTrung.trungVoi?.maPhieu || 'đã có';
    const lyDo = `Phòng ${duLieuForm.maPhong} đã có người đặt trong khung giờ này (trùng phiếu ${maPhieuTrung}).`;
    hienBannerLoi(lyDo);
    if (formContainer) {
      hienThiThongBaoForm(formContainer, lyDo, 'loi');
    }
    return;
  }

  // 3. Lưu trữ phiếu và hiển thị kết quả
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
    // Cập nhật danh sách hiển thị
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

  // Tải lại danh sách phiếu đã lưu khi khởi tạo trang (F5 còn dữ liệu)
  hienDanhSachPhieu(layTatCaPhieu());
}

// Chạy khởi tạo ứng dụng
khoiTao();


