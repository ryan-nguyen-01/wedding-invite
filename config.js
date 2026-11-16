/*
 * Toàn bộ nội dung thiệp nằm ở file này — sửa ở đây, không cần đụng code.
 * Các chỗ ghi "TODO" là thông tin còn thiếu, cần cô dâu chú rể xác nhận.
 */
window.WEDDING = {
  groom: { name: "Đỗ Khang", short: "Khang", photo: "assets/img/album-12.jpg",
    intro: "Chú rể — chàng trai của làng quê Linh Khê, Hải Phòng." },
  bride: { name: "Phạm Hằng", short: "Hằng", photo: "assets/img/album-01.jpg",
    intro: "Cô dâu — cô gái của mảnh đất Thọ Văn, Phú Thọ." },

  // Mốc đếm ngược (giờ Việt Nam). TODO: thay bằng giờ lễ chính khi có lịch.
  countdownTo: "2026-11-28T08:00:00+07:00",
  dateText: "27 & 28 . 11 . 2026",
  lunarText: "Tức ngày 19 & 20 tháng 10 năm Bính Ngọ",
  calendar: { year: 2026, month: 11, highlight: [27, 28] },

  // TODO: chưa rõ ngày/giờ từng sự kiện. Điền "time" và "date" khi có lịch;
  // để trống thì thiệp hiện "Đang cập nhật".
  // "pin": toạ độ chính xác cho bản đồ nhúng, VD "20.8123,106.6789" (Google Maps → giữ ngón tay vào nhà → copy số).
  //        Để trống thì bản đồ tìm theo "address" (chỉ chính xác tới mức thôn/xã).
  events: [
    {
      side: "Nhà gái", title: "Tiệc cưới nhà gái",
      date: "", time: "", lunar: "",
      place: "Tư gia nhà gái",
      address: "Khu 3, xã Thọ Văn, tỉnh Phú Thọ",
      map: "https://www.google.com/maps/search/?api=1&query=Khu+3+x%C3%A3+Th%E1%BB%8D+V%C4%83n+Ph%C3%BA+Th%E1%BB%8D"
    },
    {
      side: "Nhà trai", title: "Tiệc cưới nhà trai",
      date: "", time: "", lunar: "",
      place: "Tư gia nhà trai",
      address: "Thôn Linh Khê, xã Trần Phú, TP Hải Phòng",
      map: "https://www.google.com/maps/search/?api=1&query=Th%C3%B4n+Linh+Kh%C3%AA+x%C3%A3+Tr%E1%BA%A7n+Ph%C3%BA+H%E1%BA%A3i+Ph%C3%B2ng"
    }
  ],

  album: [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 2, 1].map(n => `assets/img/album-${String(n).padStart(2, "0")}.jpg`),

  // Hộp mừng cưới. "bank" là mã ngân hàng trong vietqr.js (VD: "MB", "VCB", "TCB", "BIDV", "VPB"...).
  // "qr": chuỗi VietQR nguyên bản do app ngân hàng cấp (giải mã từ ảnh QR của cô dâu chú rể) — ưu tiên dùng.
  //       Để trống thì thiệp tự sinh QR từ bank + account.
  gifts: [
    { label: "Mừng cưới đến chú rể", account: "7172932088888", bank: "MB", holder: "DO VAN KHANG",
      qr: "00020101021138570010A00000072701270006970422011371729320888880208QRIBFTTA53037045802VN6304509a" },
    { label: "Mừng cưới đến cô dâu", account: "0965500796", bank: "MB", holder: "PHAM THI HANG",
      qr: "00020101021138570010A000000727012700069704220113VQRQADIHR48680208QRIBFTTA53037045802VN62150107NPS686908006304C88F" }
  ],

  // Nhạc nền: đặt file mp3 vào assets/music/ rồi sửa tên ở đây. Để "" để ẩn nút nhạc.
  music: "assets/music/le-duong.mp3",

  // URL Web App của Google Apps Script (xem apps-script.gs). Để "" thì RSVP/lời chúc chỉ lưu trên máy khách.
  sheetEndpoint: ""
};
