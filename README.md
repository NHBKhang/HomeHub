# HomeHub — Personal & Smart Home Manager

Backend FastAPI để luyện tập và sử dụng thực tế cho nhà + cá nhân. Bản đầu tiên chạy bằng SQLite, không cần cài database server. Có thể đổi sang MySQL qua `DATABASE_URL`.

## Tính năng hiện có
- Devices: quản lý thiết bị trong nhà (TV, đèn, quạt, cảm biến...)
- Tasks: quản lý việc cần làm
- Expenses: ghi chép chi tiêu cá nhân
- Health check: kiểm tra API
- Swagger UI tự sinh tại `/docs`

## 1. Yêu cầu
- Python 3.10+
- Git (không bắt buộc)

## 2. Cài đặt

Windows PowerShell:
```powershell
cd HomeHub
py -3.10 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

Nếu PowerShell chặn kích hoạt môi trường ảo, có thể chạy:
```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Mở:
- Swagger: http://127.0.0.1:8000/docs
- Health: http://127.0.0.1:8000/health

## 3. API mẫu

### Devices
- `POST /api/v1/devices/`
```json
{
  "name": "TV phòng khách",
  "device_type": "tv",
  "location": "Phòng khách",
  "ip_address": "192.168.1.20",
  "is_online": false
}
```
- `GET /api/v1/devices/`
- `GET /api/v1/devices/{device_id}`
- `PATCH /api/v1/devices/{device_id}`
- `DELETE /api/v1/devices/{device_id}`

### Tasks
- `POST /api/v1/tasks/`
```json
{
  "title": "Kiểm tra bộ lọc máy lạnh",
  "description": "Vệ sinh theo lịch",
  "priority": "medium"
}
```
- `GET /api/v1/tasks/`
- `PATCH /api/v1/tasks/{task_id}`
- `DELETE /api/v1/tasks/{task_id}`

### Expenses
- `POST /api/v1/expenses/`
```json
{
  "title": "Tiền điện",
  "amount": 350000,
  "category": "utilities",
  "note": "Hóa đơn tháng này"
}
```
- `GET /api/v1/expenses/`
- `GET /api/v1/expenses/summary`
- `DELETE /api/v1/expenses/{expense_id}`

## 4. Đổi SQLite sang MySQL
Cài driver:
```powershell
pip install pymysql
```
Trong `.env`, đặt ví dụ:
```env
DATABASE_URL=mysql+pymysql://homehub_user:your_password@127.0.0.1:3306/homehub
```
Tạo database `homehub` trước khi chạy. Không commit file `.env` lên Git.

## 5. Cấu trúc
```text
app/
  api/
    router.py
    routes/
      devices.py
      tasks.py
      expenses.py
  core/
    config.py
  db/
    base.py
    session.py
  models/
    device.py
    task.py
    expense.py
  schemas/
    device.py
    task.py
    expense.py
  services/
    device_service.py
    task_service.py
    expense_service.py
  main.py
```

## 6. Lộ trình luyện tập
1. Đọc luồng Request → Router → Schema → Service → Model → Database.
2. Thêm lọc / phân trang cho danh sách thiết bị.
3. Thêm xác thực JWT và người dùng.
4. Thêm Alembic migrations.
5. Thêm lịch sử trạng thái thiết bị và nhật ký hoạt động.
6. Tạo tác vụ nền cho nhắc việc.
7. Thêm quét mạng LAN có giới hạn, chỉ trên mạng bạn sở hữu/quản lý.
8. Kết nối TV hoặc thiết bị thật; không gửi lệnh điều khiển nếu chưa xác minh thiết bị hỗ trợ.
9. Viết test bằng pytest.
