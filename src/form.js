// src/form.js
// Phần 1 — Màn hình nhập: Form đặt phòng tự học
//
// [Câu 1 trước commit]: File này vẽ form nhập liệu cho sinh viên đặt phòng
//   (tên, MSSV, phòng, ngày, giờ bắt đầu, giờ kết thúc) và phát sự kiện
//   "phieu-dat-submit" kèm dữ liệu thô khi người dùng bấm nút Đặt.
//
// [Câu 2 trước commit]: Xoá file này → không có form → luồng lõi đứt ngay
//   từ đầu, không ai đặt được phòng.
//
// [Câu 3 trước commit]: storage.js xử lý lưu/đọc, form.js chỉ thu thập
//   dữ liệu. Không chỗ nào khác trong src/ vẽ form đặt phòng. ✓

// Danh sách phòng tự học — Người 2/4 có thể bổ sung thêm
const DANH_SACH_PHONG = [
  { ma: 'A1-01', ten: 'A1-01 (tầng 1 · 20 chỗ)' },
  { ma: 'A1-02', ten: 'A1-02 (tầng 1 · 20 chỗ)' },
  { ma: 'A2-01', ten: 'A2-01 (tầng 2 · 30 chỗ)' },
  { ma: 'A2-02', ten: 'A2-02 (tầng 2 · 30 chỗ)' },
  { ma: 'B3-01', ten: 'B3-01 (tầng 3 · 15 chỗ)' },
];

// Khung giờ cho phép (7:00 – 21:00, bước 30 phút)
function _taoKhungGio() {
  const gio = [];
  for (let h = 7; h <= 21; h++) {
    gio.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 21) gio.push(`${String(h).padStart(2, '0')}:30`);
  }
  return gio;
}
const KHUNG_GIO = _taoKhungGio();

/**
 * Khởi tạo form đặt phòng vào phần tử chứa `containerEl`.
 *
 * @param {HTMLElement} containerEl - Phần tử DOM sẽ chứa form.
 * @param {function({tenSV, mssv, maPhong, tenPhong, ngay, gioBatDau, gioKetThuc}): void} onSubmit
 *   Callback nhận object dữ liệu thô khi người dùng bấm Đặt.
 *   Người 4 sẽ truyền hàm này để nối với Người 2 (kiểm tra luật) và Người 3 (lưu trữ).
 */
export function khoiTaoForm(containerEl, onSubmit) {
  containerEl.innerHTML = _htmlForm();

  const form   = containerEl.querySelector('#form-dat-phong');
  const selGio = containerEl.querySelector('#gio-ket-thuc');
  const msgEl  = containerEl.querySelector('#form-thong-bao');

  // Khi đổi giờ bắt đầu → lọc giờ kết thúc hợp lệ (phải > giờ bắt đầu)
  containerEl.querySelector('#gio-bat-dau').addEventListener('change', (e) => {
    _capNhatGioKetThuc(selGio, e.target.value);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    msgEl.textContent = '';

    const data = {
      tenSV:      form.querySelector('#ten-sv').value.trim(),
      mssv:       form.querySelector('#mssv').value.trim(),
      maPhong:    form.querySelector('#ma-phong').value,
      tenPhong:   form.querySelector('#ma-phong').selectedOptions[0]?.text ?? '',
      ngay:       form.querySelector('#ngay-dat').value,         // 'YYYY-MM-DD'
      gioBatDau:  form.querySelector('#gio-bat-dau').value,      // 'HH:MM'
      gioKetThuc: form.querySelector('#gio-ket-thuc').value,     // 'HH:MM'
    };

    // Kiểm tra sơ bộ phía form (validation UI) — luật nghiệp vụ sâu hơn ở Người 2
    const loi = _kiemTraSoBo(data);
    if (loi) {
      msgEl.textContent = loi;
      msgEl.className = 'thong-bao loi';
      return;
    }

    // Gọi callback — Người 4 sẽ truyền hàm nối Người 2 → Người 3 vào đây
    onSubmit(data);

    // Reset form sau khi submit thành công
    form.reset();
    containerEl.querySelector('#gio-ket-thuc').innerHTML = '<option value="">— chọn giờ kết thúc —</option>';
  });
}

/**
 * Hiển thị thông báo lỗi hoặc thành công từ bên ngoài (Người 4 gọi).
 * Dùng để hiện lỗi từ Người 2 (ví dụ: "Phòng đã bị đặt trùng giờ").
 *
 * @param {HTMLElement} containerEl
 * @param {string} noiDung
 * @param {'loi'|'thanh-cong'} loai
 */
export function hienThiThongBaoForm(containerEl, noiDung, loai = 'loi') {
  const msgEl = containerEl.querySelector('#form-thong-bao');
  if (!msgEl) return;
  msgEl.textContent = noiDung;
  msgEl.className = `thong-bao ${loai}`;
}

// ─── Hàm nội bộ ────────────────────────────────────────────────────────────

function _kiemTraSoBo({ tenSV, mssv, maPhong, ngay, gioBatDau, gioKetThuc }) {
  if (!tenSV)      return 'Vui lòng nhập họ tên.';
  if (!mssv)       return 'Vui lòng nhập MSSV.';
  if (!/^\d{8}$/.test(mssv)) return 'MSSV phải gồm đúng 8 chữ số.';
  if (!maPhong)    return 'Vui lòng chọn phòng.';
  if (!ngay)       return 'Vui lòng chọn ngày đặt.';

  const homNay = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  if (ngay < homNay) return 'Không thể đặt phòng cho ngày đã qua.';

  if (!gioBatDau)  return 'Vui lòng chọn giờ bắt đầu.';
  if (!gioKetThuc) return 'Vui lòng chọn giờ kết thúc.';
  if (gioKetThuc <= gioBatDau) return 'Giờ kết thúc phải sau giờ bắt đầu.';

  return null; // Hợp lệ
}

function _capNhatGioKetThuc(selectEl, gioBatDauChon) {
  selectEl.innerHTML = '<option value="">— chọn giờ kết thúc —</option>';
  KHUNG_GIO
    .filter(g => g > gioBatDauChon)
    .forEach(g => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      selectEl.appendChild(opt);
    });
}

function _htmlForm() {
  const optPhong = DANH_SACH_PHONG
    .map(p => `<option value="${p.ma}">${p.ten}</option>`)
    .join('');

  const optGio = KHUNG_GIO
    .map(g => `<option value="${g}">${g}</option>`)
    .join('');

  return `
<section class="form-wrapper" aria-labelledby="tieu-de-form">
  <h2 id="tieu-de-form">Đặt phòng tự học</h2>

  <form id="form-dat-phong" novalidate>

    <div class="form-group">
      <label for="ten-sv">Họ và tên <span aria-hidden="true">*</span></label>
      <input id="ten-sv" type="text" required
             placeholder="Nguyễn Văn A"
             autocomplete="name">
    </div>

    <div class="form-group">
      <label for="mssv">MSSV <span aria-hidden="true">*</span></label>
      <input id="mssv" type="text" required
             placeholder="24520000" maxlength="8"
             inputmode="numeric" pattern="\\d{8}">
    </div>

    <div class="form-group">
      <label for="ma-phong">Phòng <span aria-hidden="true">*</span></label>
      <select id="ma-phong" required>
        <option value="">— chọn phòng —</option>
        ${optPhong}
      </select>
    </div>

    <div class="form-group">
      <label for="ngay-dat">Ngày đặt <span aria-hidden="true">*</span></label>
      <input id="ngay-dat" type="date" required>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="gio-bat-dau">Giờ bắt đầu <span aria-hidden="true">*</span></label>
        <select id="gio-bat-dau" required>
          <option value="">— chọn —</option>
          ${optGio}
        </select>
      </div>

      <div class="form-group">
        <label for="gio-ket-thuc">Giờ kết thúc <span aria-hidden="true">*</span></label>
        <select id="gio-ket-thuc" required>
          <option value="">— chọn giờ kết thúc —</option>
        </select>
      </div>
    </div>

    <p id="form-thong-bao" class="thong-bao" role="alert" aria-live="polite"></p>

    <button id="btn-dat-phong" type="submit">Đặt phòng</button>

  </form>
</section>`;
}
