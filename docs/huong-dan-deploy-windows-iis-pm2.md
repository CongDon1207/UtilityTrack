# Hướng dẫn deploy dự án nội bộ lên Windows Server bằng PM2 + IIS

Tài liệu này hướng dẫn deploy dự án theo mô hình:

```text
Frontend React/Vite  -> build ra dist -> chạy bằng IIS
Backend NestJS/Node  -> build ra dist -> chạy bằng PM2
Database Oracle      -> backend kết nối tới database
```

Mô hình sau khi deploy:

```text
User trong LAN
    ↓
http://IP_SERVER
    ↓
IIS serve frontend/dist
    ↓ gọi API
Backend NestJS chạy bằng PM2 ở port 3000
    ↓
Oracle Database
```

Ví dụ IP server:

```text
192.168.4.172
```

---

## 1. Chuẩn bị trên máy server

Trên Windows Server cần có:

```text
Node.js
npm
PM2
IIS
IIS URL Rewrite Module 2.1
Oracle Client hoặc cấu hình kết nối Oracle nếu backend cần
```

Kiểm tra Node.js và npm:

```bash
node -v
npm -v
```

Nếu chưa có Node.js thì cài Node.js bản LTS.

---

# Phần A. Deploy backend bằng PM2

## 2. Build backend trên máy dev hoặc trên server

Vào thư mục backend:

```bash
cd backend
npm install
npm run build
```

Sau khi build xong, backend sẽ có thư mục:

```text
backend/dist/
```

File chạy chính thường là:

```text
backend/dist/main.js
```

---

## 3. Copy backend lên server

Tạo thư mục deploy trên server, ví dụ:

```text
D:\deploy\UtilityTrack\backend
```

Copy các file/thư mục sau vào server:

```text
backend/dist/
backend/package.json
backend/package-lock.json
backend/.env
```

Cấu trúc trên server nên là:

```text
D:\deploy\UtilityTrack\backend
├── dist
│   └── main.js
├── package.json
├── package-lock.json
└── .env
```

Không cần copy thư mục `src`.

---

## 4. Cài package production cho backend

Mở CMD hoặc PowerShell trên server:

```bash
cd /d D:\deploy\UtilityTrack\backend
npm install --omit=dev
```

Lệnh này chỉ cài package cần cho production.

---

## 5. Cài PM2

Cài PM2 global:

```bash
npm install -g pm2
```

Kiểm tra PM2:

```bash
pm2 -v
```

---

## 6. Chạy backend bằng PM2

Trong thư mục backend trên server:

```bash
cd /d D:\deploy\UtilityTrack\backend
pm2 start dist/main.js --name utility-backend
```

Kiểm tra app:

```bash
pm2 list
```

Nếu thấy `utility-backend` có status `online` là backend đã chạy.

Xem log:

```bash
pm2 logs utility-backend
```

Restart backend:

```bash
pm2 restart utility-backend
```

Dừng backend:

```bash
pm2 stop utility-backend
```

Xóa process khỏi PM2:

```bash
pm2 delete utility-backend
```

---

## 7. Lưu process PM2

Sau khi backend chạy ổn:

```bash
pm2 save
```

Trên Windows Server, nếu muốn PM2 tự chạy lại sau khi restart máy, có thể dùng thêm:

```bash
npm install -g pm2-windows-startup
pm2-startup install
pm2 save
```

Sau đó restart server và kiểm tra lại:

```bash
pm2 list
```

---

# Phần B. Deploy frontend bằng IIS

## 8. Cấu hình API URL cho frontend

Trong frontend, tạo hoặc sửa file:

```text
.env.production
```

Ví dụ:

```env
VITE_API_BASE_URL=http://192.168.4.172:3000
```

Lưu ý: không nên để như sau khi deploy LAN:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Vì khi máy user truy cập, `localhost` sẽ là máy của user, không phải server.

---

## 9. Build frontend

Vào thư mục frontend:

```bash
cd frontend
npm install
npm run build
```

Sau khi build xong, frontend sẽ có:

```text
frontend/dist/
├── index.html
└── assets/
```

---

## 10. Bật IIS trên Windows Server

Mở:

```text
Server Manager
→ Add roles and features
→ Server Roles
→ Web Server (IIS)
```

Nên bật các mục cơ bản:

```text
Web Server (IIS)
├── Web Management Tools
│   └── IIS Management Console
└── World Wide Web Services
    ├── Common HTTP Features
    │   ├── Default Document
    │   ├── Static Content
    │   └── HTTP Errors
```

Sau khi cài xong, mở trình duyệt trên server:

```text
http://localhost
```

Nếu hiện trang IIS Welcome là IIS đã chạy.

---

## 11. Tạo thư mục chứa frontend trên IIS

Tạo thư mục:

```text
C:\inetpub\wwwroot\utilitytrack
```

Copy toàn bộ nội dung bên trong:

```text
frontend/dist/
```

vào:

```text
C:\inetpub\wwwroot\utilitytrack
```

Cấu trúc đúng:

```text
C:\inetpub\wwwroot\utilitytrack
├── index.html
└── assets
    ├── xxx.js
    └── xxx.css
```

Không nên copy thành:

```text
C:\inetpub\wwwroot\utilitytrack\dist\index.html
```

---

## 12. Tạo Website trong IIS

Mở:

```text
Internet Information Services (IIS) Manager
```

Tạo website mới:

```text
Sites
→ Right click
→ Add Website
```

Điền thông tin ví dụ:

```text
Site name: UtilityTrack
Physical path: C:\inetpub\wwwroot\utilitytrack
Binding type: http
IP address: All Unassigned
Port: 80
Host name: để trống
```

Nếu port 80 đang bị `Default Web Site` dùng, có 2 cách:

### Cách 1: Stop Default Web Site

```text
Sites
→ Default Web Site
→ Stop
```

Sau đó dùng port 80 cho `UtilityTrack`.

User truy cập:

```text
http://192.168.4.172
```

### Cách 2: Dùng port khác

Ví dụ dùng port 8080:

```text
Port: 8080
```

User truy cập:

```text
http://192.168.4.172:8080
```

---

## 13. Kiểm tra Default Document

Trong IIS Manager:

```text
Sites
→ UtilityTrack
→ Default Document
```

Đảm bảo có:

```text
index.html
```

Nếu chưa có thì thêm `index.html`.

---

# Phần C. Cài IIS URL Rewrite Module 2.1

## 14. Vì sao cần URL Rewrite Module?

Với React/Vite dùng SPA routing, các URL như:

```text
/admin
/security
/reports
```

thực tế không phải file thật trên server.

Nếu refresh trực tiếp ở:

```text
http://192.168.4.172/security
```

IIS có thể báo 404 vì nó đi tìm file/thư mục thật tên `security`.

Cách xử lý là dùng URL Rewrite để mọi route phụ fallback về:

```text
/index.html
```

Sau đó React Router sẽ tự xử lý route.

---

## 15. Tải và cài URL Rewrite Module 2.1

Tải từ trang chính thức của Microsoft IIS:

```text
https://www.iis.net/downloads/microsoft/url-rewrite
```

Chọn:

```text
URL Rewrite Module 2.1
x64 installer
```

Cài đặt:

```text
1. Download file .msi
2. Run as Administrator
3. Next
4. Accept
5. Install
6. Cài xong thì mở lại IIS Manager
```

Kiểm tra đã cài thành công:

```text
IIS Manager
→ Click vào server hoặc website
→ Nếu thấy icon "URL Rewrite" là đã cài thành công
```

Nếu chưa thấy, đóng IIS Manager rồi mở lại bằng quyền Administrator.

---

## 16. Thêm file web.config cho React/Vite

Trong thư mục IIS đang chứa frontend:

```text
C:\inetpub\wwwroot\utilitytrack
```

Tạo file:

```text
web.config
```

Nằm cùng cấp với:

```text
index.html
assets/
```

Nội dung file `web.config`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React SPA Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

Sau đó restart website hoặc restart IIS:

```bash
iisreset
```

Test lại:

```text
http://192.168.4.172/security
http://192.168.4.172/admin
```

Nếu refresh ở route phụ không bị 404 nữa là đã đúng.

---

# Phần D. Mở firewall

Nếu dùng port 80:

```text
Windows Defender Firewall
→ Advanced settings
→ Inbound Rules
→ New Rule
→ Port
→ TCP
→ 80
→ Allow the connection
```

Nếu dùng port 8080 thì mở TCP 8080.

Backend chạy port 3000 cũng cần mở nếu frontend gọi trực tiếp:

```text
TCP 3000
```

Nhưng nếu sau này cấu hình IIS reverse proxy thì user không cần gọi trực tiếp port 3000 nữa.

---

# Phần E. Quy trình update source code

## 17. Update backend

Khi sửa backend:

```bash
cd backend
npm run build
```

Copy lại:

```text
backend/dist/
```

đè lên:

```text
D:\deploy\UtilityTrack\backend\dist
```

Sau đó restart PM2:

```bash
cd /d D:\deploy\UtilityTrack\backend
pm2 restart utility-backend
```

Nếu có thay đổi package trong `package.json`, chạy thêm:

```bash
npm install --omit=dev
pm2 restart utility-backend
```

---

## 18. Update frontend

Khi sửa frontend:

```bash
cd frontend
npm run build
```

Copy toàn bộ nội dung trong:

```text
frontend/dist/
```

đè vào:

```text
C:\inetpub\wwwroot\utilitytrack
```

Thường không cần restart IIS.

Nếu trình duyệt vẫn thấy giao diện cũ, bấm:

```text
Ctrl + F5
```

hoặc clear cache trình duyệt.

---

# Phần F. Checklist kiểm tra sau deploy

## Backend

```bash
pm2 list
```

Cần thấy:

```text
utility-backend  online
```

Test API:

```text
http://192.168.4.172:3000
```

Xem log nếu lỗi:

```bash
pm2 logs utility-backend
```

---

## Frontend

Test từ máy khác trong LAN:

```text
http://192.168.4.172
```

Hoặc nếu dùng port 8080:

```text
http://192.168.4.172:8080
```

Test route phụ:

```text
http://192.168.4.172/admin
http://192.168.4.172/security
```

Nếu route phụ lỗi 404, kiểm tra:

```text
1. Đã cài URL Rewrite Module 2.1 chưa?
2. IIS Manager có icon URL Rewrite chưa?
3. web.config có nằm cùng cấp index.html không?
4. XML trong web.config có sai cú pháp không?
5. Đã chạy iisreset chưa?
```

---

# Phần G. Tóm tắt lệnh quan trọng

## Backend lần đầu

```bash
cd /d D:\deploy\UtilityTrack\backend
npm install --omit=dev
npm install -g pm2
pm2 start dist/main.js --name utility-backend
pm2 save
```

## Backend mỗi lần update

```bash
cd /d D:\deploy\UtilityTrack\backend
pm2 restart utility-backend
```

## Frontend mỗi lần update

```bash
cd frontend
npm run build
```

Sau đó copy nội dung trong `frontend/dist/` vào:

```text
C:\inetpub\wwwroot\utilitytrack
```

## IIS restart nếu cần

```bash
iisreset
```

---

# Ghi nhớ

```text
PM2 dùng để chạy backend NodeJS/NestJS.
IIS dùng để serve frontend React/Vite dist.
URL Rewrite Module dùng để fix lỗi refresh route phụ như /admin, /security.
Không chạy production bằng npm run dev.
Không cần copy thư mục src lên server nếu chỉ chạy bản build.
```
