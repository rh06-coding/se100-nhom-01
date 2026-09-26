#!/usr/bin/env python3
"""
Kiểm mốc tầng 1 — SE100.

Chạy:  python scripts/kiem_moc.py M2
       python scripts/kiem_moc.py            (tự đoán mốc từ tên nhánh moc/Mn)

Mọi kiểm tra là tất định, không dùng AI. Đầu ra: danh sách ✅/❌ và exit code
0 nếu tất cả ✅. Sinh viên đọc log này để tự sửa trước hạn.
"""
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

GOC = Path(__file__).resolve().parent.parent
KQ = []  # (ok: bool, ten: str, chi_tiet: str)


def ghi(ok, ten, chi_tiet=""):
    KQ.append((ok, ten, chi_tiet))


# ---------- tiện ích ----------

def doc(path):
    p = GOC / path
    return p.read_text(encoding="utf-8") if p.exists() else None


def ton_tai(path, ten=None):
    ok = (GOC / path).exists()
    ghi(ok, ten or f"Tệp {path} tồn tại", "" if ok else f"không thấy {path}")
    return ok


def git(*args):
    try:
        return subprocess.check_output(["git", *args], cwd=GOC, text=True, stderr=subprocess.DEVNULL)
    except Exception:
        return ""


def ten_lop_trong_class_mmd(text):
    return set(re.findall(r"^\s*class\s+([A-Za-z_][A-Za-z0-9_]*)", text, re.M))


def phuong_thuc_trong_class_mmd(text):
    """{ten_lop: {ten_phuong_thuc}} — đọc các dòng dạng +ten(...) trong khối class X { }"""
    kq = {}
    for m in re.finditer(r"class\s+(\w+)\s*\{(.*?)\}", text, re.S):
        lop, than = m.group(1), m.group(2)
        kq[lop] = set(re.findall(r"[+\-#~]?\s*(\w+)\s*\(", than))
    # dạng ngoài khối: Lop : +ten()
    for lop, pt in re.findall(r"^\s*(\w+)\s*:\s*[+\-#~]?\s*(\w+)\s*\(", text, re.M):
        kq.setdefault(lop, set()).add(pt)
    return kq


def participant_trong_seq(text):
    """Mọi bên tham gia là LỚP: khai báo bằng participant, hoặc xuất hiện trong
    thông điệp mà không được khai báo là actor. Mermaid tự tạo participant từ
    thông điệp nên phải quét cả dòng thông điệp."""
    actors = set(re.findall(r"^\s*actor\s+(\w+)", text, re.M))
    ps = set(re.findall(r"^\s*participant\s+(\w+)", text, re.M))
    for nguon, dich, _ in loi_goi_trong_seq(text):
        ps.add(nguon); ps.add(dich)
    for nguon, dich in re.findall(r"^\s*(\w+)\s*-{1,2}>>?\s*(\w+)\s*:", text, re.M):
        ps.add(nguon); ps.add(dich)
    return ps - actors


def loi_goi_trong_seq(text):
    """[(nguon, dich, phuong_thuc)] từ dòng A->>B: ten(...)"""
    return re.findall(r"^\s*(\w+)\s*-{1,2}>>?\s*(\w+)\s*:\s*(?:new\s+)?(\w+)\s*\(", text, re.M)


def _kiem_so_bo(p):
    dau = (p.read_text(encoding="utf-8").strip().splitlines() or [""])[0].strip()
    ok = bool(re.match(r"^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|C4Context|C4Container|erDiagram)", dau))
    return ok, "" if ok else f"dòng đầu không phải loại sơ đồ Mermaid: '{dau[:40]}'"


def mermaid_parse_duoc(path):
    """Kiểm cú pháp Mermaid bằng mmdc nếu chạy được; nếu mmdc không có hoặc
    không mở được trình duyệt (thiếu Chromium) thì kiểm sơ bộ theo dòng đầu."""
    p = GOC / path
    if not p.exists():
        return False, "không thấy tệp"
    mmdc = os.environ.get("MMDC", "mmdc")
    try:
        subprocess.run(
            [mmdc, "-i", str(p), "-o", "/tmp/_kiem.svg", "-q"],
            check=True, capture_output=True, timeout=120,
        )
        return True, ""
    except FileNotFoundError:
        return _kiem_so_bo(p)
    except subprocess.TimeoutExpired:
        return _kiem_so_bo(p)
    except subprocess.CalledProcessError as e:
        err = (e.stderr or b"").decode(errors="ignore")
        # lỗi hạ tầng (không phải lỗi cú pháp) → không phạt sinh viên
        if re.search(r"puppeteer|chrom|browser|launch|ENOENT|libnss|libatk", err, re.I):
            return _kiem_so_bo(p)
        # lỗi cú pháp thật: lấy dòng có ích nhất
        dong = [d for d in err.splitlines() if re.search(r"Parse error|Syntax error|Expecting|Lexical", d)]
        return False, (dong[0] if dong else err.strip().splitlines()[-1] if err.strip() else "mmdc báo lỗi")[:200]


# ---------- kiểm chung mọi mốc ----------

def kiem_chung(moc):
    # bản phản tư
    pt = doc(f"phan-tu/{moc}.md")
    if pt is None:
        ghi(False, f"phan-tu/{moc}.md tồn tại", "thiếu bản phản tư")
    else:
        hash_ = re.findall(r"\b[0-9a-f]{7,40}\b", pt)
        ghi(len(hash_) >= 1, f"phan-tu/{moc}.md trỏ tới ít nhất 1 commit",
            "" if hash_ else "không thấy mã commit 7 ký tự nào — mọi khẳng định phải có hash")
        nguong = 40 if moc == "M0" else 120
        ghi(len(pt.split()) >= nguong, f"phan-tu/{moc}.md dài ≥ {nguong} từ", f"hiện {len(pt.split())} từ")

    # bảng phản hồi cáo buộc từ M2 (chỉ cảnh báo, vì có thể chưa nhận cáo buộc)
    if moc in ("M2", "M3", "M4", "M5"):
        ph = doc(f"phan-tu/{moc}-phan-hoi.md")
        if ph is None:
            ghi(True, f"phan-tu/{moc}-phan-hoi.md (nộp sau khi nhận cáo buộc)", "chưa có — sẽ kiểm lại sau")

    # ai-log
    ai = list((GOC / "ai-log").glob(f"*{moc}*")) if (GOC / "ai-log").exists() else []
    ghi(len(ai) >= 1, f"ai-log/ có bản ghi cho {moc}", "" if ai else "thiếu bản ghi hội thoại với agent")


# ---------- từng mốc ----------

def kiem_M0():
    readme = doc("README.md") or ""
    dong = [d for d in readme.splitlines() if d.strip() and not d.strip().startswith(("#", "|", ">", "-", "`"))]
    ghi(len(dong) >= 5, "README có ≥ 5 dòng mô tả hệ thống", f"hiện {len(dong)} dòng văn xuôi")
    ghi("Xoá dòng này" not in readme, "README đã xoá hướng dẫn mẫu", "")

    tac_gia = set(a.strip() for a in git("log", "--format=%ae").splitlines() if a.strip())
    ghi(len(tac_gia) >= 4, f"Đủ 4 thành viên có commit (thấy {len(tac_gia)} email)",
        "" if len(tac_gia) >= 4 else "mỗi người phải tự commit ít nhất một lần bằng tài khoản của mình")

    ton_tai("docs/cau-hoi-khach-hang.md", "Có 3 câu hỏi cho khách hàng")
    ch = doc("docs/cau-hoi-khach-hang.md") or ""
    so_cau = len(re.findall(r"\?", ch))
    ghi(so_cau >= 3, "Ít nhất 3 câu hỏi (đếm dấu ?)", f"thấy {so_cau}")


def kiem_M1():
    yc = doc("docs/yeu-cau.md")
    if yc is None:
        ghi(False, "docs/yeu-cau.md tồn tại"); return

    # bảng NFR: các dòng bắt đầu bằng | NFR-
    nfr = [d for d in yc.splitlines() if re.match(r"^\|\s*NFR-\d+", d)]
    ghi(len(nfr) >= 3, f"Có ≥ 3 yêu cầu phi chức năng (thấy {len(nfr)})")
    # mỗi NFR phải có số + đơn vị
    don_vi = r"(ms|s|giây|phút|giờ|ngày|%|người|req|yêu cầu|MB|GB|KB|TPS|rps|/s|/giây|lần|bản ghi|dòng|đồng)"
    thieu = []
    for d in nfr:
        o = [x.strip() for x in d.strip("|").split("|")]
        noi_dung = " ".join(o[1:4])
        if not re.search(r"\d+[\d.,]*\s*" + don_vi, noi_dung, re.I):
            thieu.append(o[0] if o else d[:20])
    ghi(not thieu, "Mỗi NFR có con số kèm đơn vị",
        "" if not thieu else f"thiếu số/đơn vị ở: {', '.join(thieu)} — 'nhanh', 'ổn định' không tính")

    fr = [d for d in yc.splitlines() if re.match(r"^\|\s*FR-\d+", d)]
    ghi(len(fr) >= 6, f"Có ≥ 6 yêu cầu chức năng (thấy {len(fr)})")
    br = [d for d in yc.splitlines() if re.match(r"^\|\s*BR-\d+", d)]
    ghi(len(br) >= 1, f"Có ≥ 1 ràng buộc nghiệp vụ (thấy {len(br)})")
    tn = len(re.findall(r"^\|\s*[^|\-#]+\|[^|]+\|[^|]+\|\s*$", yc.split("## Yêu cầu chức năng")[0], re.M))
    ghi(tn >= 3 + 1, "Có ≥ 3 tác nhân", f"đếm được {max(tn-1,0)} dòng trong bảng tác nhân")


def kiem_M2():
    ok, loi = mermaid_parse_duoc("diagrams/use-case.mmd")
    ghi(ok, "diagrams/use-case.mmd parse được", loi)
    uc = doc("diagrams/use-case.mmd") or ""
    # use case dạng UC1(Tên) — loại tác nhân dạng SV([Tên]) và subgraph
    so_uc = len(re.findall(r"^\s*\w+\((?!\[)[^)]+\)\s*$", uc, re.M))
    ghi(so_uc >= 5, f"Sơ đồ use case có ≥ 5 use case (thấy {so_uc})")

    dac_ta = sorted((GOC / "docs").glob("dac-ta-UC-*.md"))
    ghi(len(dac_ta) >= 3, f"Có ≥ 3 đặc tả use case (thấy {len(dac_ta)})")
    for p in dac_ta[:3]:
        t = p.read_text(encoding="utf-8")
        ghi("Luồng thay thế" in t and "Luồng lỗi" in t, f"{p.name} có luồng thay thế và luồng lỗi")

    seqs = sorted((GOC / "diagrams").glob("seq-*.mmd"))
    ghi(len(seqs) >= 2, f"Có ≥ 2 sequence diagram (thấy {len(seqs)})")
    for p in seqs:
        ok, loi = mermaid_parse_duoc(f"diagrams/{p.name}")
        ghi(ok, f"{p.name} parse được", loi)

    pr = git("log", "--oneline", "--merges", "-5")
    ghi(True, "Pull request review chéo — kiểm tay", "")


def kiem_M3():
    ok, loi = mermaid_parse_duoc("diagrams/class.mmd")
    ghi(ok, "diagrams/class.mmd parse được", loi)
    ok2, loi2 = mermaid_parse_duoc("diagrams/state.mmd")
    ghi(ok2, "diagrams/state.mmd parse được", loi2)

    cls = doc("diagrams/class.mmd") or ""
    lop = ten_lop_trong_class_mmd(cls)
    ghi(len(lop) >= 5, f"Sơ đồ lớp có ≥ 5 lớp (thấy {len(lop)})")
    pt = phuong_thuc_trong_class_mmd(cls)
    tui_du_lieu = [l for l in lop if not pt.get(l)]
    ghi(len(tui_du_lieu) <= len(lop) // 2,
        "Không quá nửa số lớp là 'túi dữ liệu' không có phương thức",
        "" if len(tui_du_lieu) <= len(lop) // 2 else f"lớp không có hành vi: {', '.join(sorted(tui_du_lieu))}")

    # ---- ĐỐI CHIẾU CHÉO: lớp trong sequence phải có trong class diagram ----
    seqs = sorted((GOC / "diagrams").glob("seq-*.mmd"))
    thieu_lop, thieu_pt = set(), []
    for p in seqs:
        t = p.read_text(encoding="utf-8")
        for part in participant_trong_seq(t):
            if part not in lop:
                thieu_lop.add(f"{part} ({p.name})")
        for nguon, dich, ph in loi_goi_trong_seq(t):
            if dich in lop and ph not in pt.get(dich, set()) and ph != dich:
                thieu_pt.append(f"{dich}.{ph}() ({p.name})")
    ghi(not thieu_lop, "Mọi participant trong sequence diagram đều là lớp trong class.mmd",
        "" if not thieu_lop else "không có trong sơ đồ lớp: " + ", ".join(sorted(thieu_lop)))
    ghi(not thieu_pt, "Mọi phương thức được gọi trong sequence đều tồn tại trong lớp đích",
        "" if not thieu_pt else "gọi phương thức không tồn tại: " + ", ".join(thieu_pt[:8]))

    # ---- TRUY VẾT: mỗi lớp phải được nhắc trong ít nhất một đặc tả hoặc yêu cầu ----
    van_ban = " ".join((GOC / "docs" / f).read_text(encoding="utf-8")
                       for f in os.listdir(GOC / "docs") if f.endswith(".md")) if (GOC / "docs").exists() else ""
    mo_coi = [l for l in lop if not re.search(r"\b" + re.escape(l) + r"\b", van_ban)]
    ghi(len(mo_coi) == 0, "Mọi lớp được nhắc tới trong docs/ (truy vết về yêu cầu)",
        "" if not mo_coi else "lớp không xuất hiện trong bất kỳ đặc tả/yêu cầu nào: " + ", ".join(sorted(mo_coi)))

    ton_tai("docs/tu-danh-gia-M3.md", "Có bản tự đánh giá cohesion/coupling")


def kiem_M4():
    for f in ("diagrams/c4-context.mmd", "diagrams/c4-container.mmd"):
        ok, loi = mermaid_parse_duoc(f)
        ghi(ok, f"{f} parse được", loi)
    ton_tai("docs/du-lieu.md", "Có tài liệu thiết kế dữ liệu")

    adrs = [p for p in (GOC / "adr").glob("*.md") if not p.name.startswith("0000")]
    ghi(len(adrs) >= 1, f"Có ≥ 1 ADR ngoài mẫu (thấy {len(adrs)})")
    for p in adrs[:3]:
        t = p.read_text(encoding="utf-8")
        ghi("## Các phương án đã cân nhắc" in t and t.count("|") >= 12,
            f"{p.name} có bảng phương án đã cân nhắc (≥ 2 phương án)")

    ag = doc("AGENTS.md") or ""
    kien_truc = ag.split("## Kiến trúc")[1].split("## Kiểm thử")[0] if "## Kiến trúc" in ag else ""
    da_viet = bool(kien_truc.strip()) and "<!--" not in kien_truc
    ghi(da_viet, "AGENTS.md phần Kiến trúc đã viết (không còn comment mẫu)",
        "" if da_viet else "phần '## Kiến trúc' vẫn còn <!-- ví dụ --> — thay bằng ràng buộc thật của nhóm")
    # ràng buộc thật: dòng gạch đầu dòng có chữ "không" bên ngoài tiêu đề
    rang_buoc = [d for d in kien_truc.splitlines() if d.strip().startswith("-") and "không" in d.lower()]
    ghi(len(rang_buoc) >= 1, "AGENTS.md có ít nhất một dòng ràng buộc 'không được'",
        "" if rang_buoc else "cần ít nhất một gạch đầu dòng dạng '- Không ... từ ...'")


def kiem_M5():
    url = None
    readme = doc("README.md") or ""
    m = re.search(r"Bản chạy:\s*(https?://\S+)", readme)
    if m:
        url = m.group(1).rstrip(")")
    if url and url != "https://":
        try:
            with urllib.request.urlopen(url, timeout=15) as r:
                ghi(r.status == 200, f"URL deploy trả về 200: {url}", f"mã {r.status}")
        except Exception as e:
            ghi(False, f"URL deploy sống: {url}", str(e)[:120])
    else:
        ghi(False, "README có URL 'Bản chạy:' đã điền", "chưa điền URL")

    wf = list((GOC / ".github" / "workflows").glob("*.yml"))
    co_pipeline_rieng = any("kiem-moc" not in p.name for p in wf)
    ghi(co_pipeline_rieng, "Có workflow CI riêng của nhóm ngoài kiem-moc.yml",
        "" if co_pipeline_rieng else "thêm ít nhất một workflow: lint / test / build / deploy")

    ton_tai("docs/tac-dong-vong3.md", "Có bảng phân tích tác động vòng 3")

    tl = doc("docs/trung-lap.md") or ""
    so_do = len(re.findall(r"\d+[.,]?\d*\s*%", tl))
    ghi(so_do >= 2, "docs/trung-lap.md có ít nhất 2 lần đo (% tuần 3 và % tuần 13)",
        "" if so_do >= 2 else f"thấy {so_do} con số % — cần đo lại bằng jscpd và ghi thêm")


# ---------- chạy ----------

def doan_moc():
    nhanh = os.environ.get("GITHUB_HEAD_REF") or git("rev-parse", "--abbrev-ref", "HEAD").strip()
    m = re.search(r"moc/(M[0-5])", nhanh)
    return m.group(1) if m else None


def main():
    arg = sys.argv[1].strip().upper() if len(sys.argv) > 1 else ""
    moc = arg if arg else doan_moc()
    if moc not in {"M0", "M1", "M2", "M3", "M4", "M5"}:
        print("Không xác định được mốc. Dùng: python scripts/kiem_moc.py M2  hoặc đặt tên nhánh moc/M2")
        sys.exit(2)

    print(f"\n=== KIỂM MỐC {moc} ===\n")
    {"M0": kiem_M0, "M1": kiem_M1, "M2": kiem_M2, "M3": kiem_M3, "M4": kiem_M4, "M5": kiem_M5}[moc]()
    if moc != "M0":
        kiem_chung(moc)
    else:
        kiem_chung(moc)

    dat = sum(1 for ok, *_ in KQ if ok)
    for ok, ten, ct in KQ:
        print(("✅ " if ok else "❌ ") + ten + (f"\n     ↳ {ct}" if ct and not ok else ""))
    print(f"\n{dat}/{len(KQ)} đạt.")
    if dat < len(KQ):
        print("Mốc CHƯA đạt. Sửa các ❌ rồi push lại — không cần chờ giảng viên.")
        sys.exit(1)
    print("Mốc đạt cổng tầng 1. Phần điểm nằm ở bản phản tư.")


if __name__ == "__main__":
    main()
