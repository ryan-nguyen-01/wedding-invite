/*
 * Toàn bộ nội dung thiệp nằm ở file này — sửa ở đây, không cần đụng code.
 * Các chỗ ghi "TODO" là thông tin còn thiếu, cần cô dâu chú rể xác nhận.
 */
window.WEDDING = {
  groom: { name: "Đỗ Khang", photo: "assets/img/album-12.jpg",
    intro: "Chú rể — chàng trai của làng quê Linh Khê, Hải Phòng." },
  bride: { name: "Phạm Hằng", photo: "assets/img/album-01.jpg",
    intro: "Cô dâu — cô gái của mảnh đất Thọ Văn, Phú Thọ." },

  // Mốc đếm ngược (giờ Việt Nam): tiệc chính nhà trai 11:00 ngày 28/11.
  countdownTo: "2026-11-28T11:00:00+07:00",
  dateText: "27 & 28 . 11 . 2026",
  lunarText: "Tức ngày 19 & 20 tháng 10 năm Bính Ngọ",
  calendar: { year: 2026, month: 11, highlight: [27, 28] },

  // Mỗi bên có danh sách "slots" (giờ, ngày, âm lịch). Để slots rỗng thì thiệp hiện "Đang cập nhật".
  // "map": link mở Google Maps cho nút "Xem chỉ đường" (có thể thay bằng link ghim chính xác maps.app.goo.gl/...).
  events: [
    {
      side: "Nhà gái", title: "Tiệc cưới nhà gái",
      slots: [
        { time: "14:30", date: "Thứ Sáu, 27/11/2026", lunar: "Tức ngày 19/10 Bính Ngọ" },
        { time: "10:00", date: "Thứ Bảy, 28/11/2026", lunar: "Tức ngày 20/10 Bính Ngọ" }
      ],
      place: "Tư gia nhà gái",
      address: "Khu 3, xã Thọ Văn, tỉnh Phú Thọ",
      map: "https://www.google.com/maps/search/?api=1&query=Khu+3+x%C3%A3+Th%E1%BB%8D+V%C4%83n+Ph%C3%BA+Th%E1%BB%8D"
    },
    {
      side: "Nhà trai", title: "Tiệc cưới nhà trai",
      slots: [
        { time: "16:00", date: "Thứ Sáu, 27/11/2026", lunar: "Tức ngày 19/10 Bính Ngọ" },
        { time: "11:00", date: "Thứ Bảy, 28/11/2026", lunar: "Tức ngày 20/10 Bính Ngọ" }
      ],
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
