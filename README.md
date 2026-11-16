# Thiệp cưới Khang & Hằng

Trang tĩnh, không cần build. Chỉ có HTML, CSS và JS thuần.

## Sửa nội dung
Toàn bộ nội dung nằm trong `config.js`: tên, ngày, sự kiện, album, số tài khoản, nhạc. Tìm các chỗ `TODO`.

- **Mã QR mừng cưới:** điền `bank` bằng mã ngân hàng có trong `vietqr.js` (ví dụ `"MB"`, `"VCB"`, `"TCB"`, `"BIDV"`). QR được tạo ngay trên trình duyệt.
- **Nhạc:** chép file mp3 vào `assets/music/le-duong.mp3`. Chưa có file thì nút nhạc tự ẩn.
- **Xác nhận tham dự và lời chúc:** làm theo hướng dẫn ở đầu `apps-script.gs`, rồi dán URL vào `sheetEndpoint`.
- **Tên khách:** gửi link dạng `https://<domain>/?to=Anh%20Tuấn`.

## Xem trên máy
```bash
cd source/wedding-invite && python3 -m http.server 8000   # mở http://localhost:8000
```

## Đưa lên Vercel
```bash
npm i -g vercel
cd source/wedding-invite
vercel          # lần đầu: đăng nhập và tạo project
vercel --prod   # bản chính thức
```
Cách khác: kéo thả thư mục này vào https://vercel.com/new.

Sau khi có domain, sửa `og:image` trong `index.html` thành URL tuyệt đối, ví dụ `https://khang-hang.vercel.app/assets/img/og.jpg`. Như vậy khi gửi link qua Zalo hoặc Messenger sẽ hiện ảnh xem trước.
# wedding-invite
