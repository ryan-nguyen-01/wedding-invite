/**
 * Google Apps Script — lưu Lời chúc vào Google Sheet và trả danh sách lời chúc cho thiệp.
 *
 * Cách cài (5 phút):
 * 1. Tạo Google Sheet mới → Tiện ích mở rộng → Apps Script.
 * 2. Dán toàn bộ file này vào, bấm Lưu.
 * 3. Triển khai → Tùy chọn triển khai mới → Loại: Ứng dụng web
 *    - Thực thi với tư cách: Tôi
 *    - Người có quyền truy cập: Bất kỳ ai
 * 4. Copy URL Web App (dạng https://script.google.com/macros/s/.../exec) vào config.js → sheetEndpoint.
 *
 * Muốn ẩn một lời chúc không phù hợp: gõ "x" vào cột "Ẩn" của dòng đó.
 */
const HEADER = ["Thời gian", "Tên", "Lời chúc", "Ẩn (x)", "Link khách"];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("wish");
  if (!sh) { sh = ss.insertSheet("wish"); sh.appendRow(HEADER); sh.setFrozenRows(1); }
  return sh;
}

const clip_ = (v, n) => String(v || "").slice(0, n);

function doPost(e) {
  const d = JSON.parse(e.postData.contents || "{}");
  if (d.type === "wish" && d.name && d.message) {
    sheet_().appendRow([new Date(), clip_(d.name, 60), clip_(d.message, 500), "", clip_(d.guestLink, 60)]);
  }
  return ContentService.createTextOutput("ok");
}

function doGet() {
  const rows = sheet_().getDataRange().getValues().slice(1)
    .filter(r => r[1] && r[2] && String(r[3]).toLowerCase() !== "x")
    .reverse().slice(0, 300)
    .map(r => ({ name: r[1], message: r[2] }));
  return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(ContentService.MimeType.JSON);
}
