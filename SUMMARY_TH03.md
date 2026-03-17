# 📋 Project Summary | Booking System (TH03)

> **Mô tả:** Hệ thống quản lý đặt lịch hẹn dịch vụ chuyên nghiệp, được thiết kế với kiến trúc bền vững và giao diện hiện đại. Toàn bộ dữ liệu được quản lý client-side, đảm bảo tốc độ phản hồi nhanh và khả năng lưu trữ không cần backend (Data Bền Vững).

---

## 🚀 Công Nghệ Sử Dụng

| Thành phần | Công nghệ |
| :--- | :--- |
| **Frontend Framework** | React 17 + UmiJS 3 |
| **UI Library** | Ant Design (AntD) v4 |
| **Styling** | Tailwind CSS v4 |
| **Data Persistence** | LocalStorage API (Repository Pattern) |
| **Charts** | ApexCharts |
| **Date Management** | Moment.js |

---

## ✨ Các Tính Năng Chính

### 1. 📅 Quản Lý Đặt Lịch (Booking Management)
- Giao diện đặt lịch trực quan với Form thông minh.
- **Ràng buộc thời gian:** Không cho phép đặt lịch trong quá khứ.
- **Kiểm tra trùng lặp:** Tự động kiểm tra xung đột thời gian của nhân viên.
- **Giới hạn sức chứa:** Tự động kiểm tra số lượng khách tối đa của nhân viên trong ngày.

### 2. 📊 Dashboard Thống Kê (Admin Stats)
- **Biểu đồ doanh thu:** Theo dõi doanh thu dự kiến theo tháng thông qua biểu đồ diện tích (Area Chart) mượt mà.
- **Thống kê tổng quan:** Doanh thu tổng, số lượng lịch hoàn thành, số lượng khách hàng độc nhất.
- **Hiệu suất nhân viên:** Bảng xếp hạng nhân viên dựa trên doanh thu và số lịch đã hoàn thành.
- **Phân tích dịch vụ:** Xem dịch vụ nào đang mang lại nguồn thu chính.

### 3. 💾 Kiến Trúc Dữ Liệu Bền Vững (Storage)
- Sử dụng **Repository Pattern** để trừu tượng hóa việc truy cập dữ liệu.
- Lưu trữ 100% dữ liệu vào `LocalStorage`, giúp dữ liệu không bị mất khi F5 hoặc đóng trình duyệt.

---

## 🛠 Cấu Trúc Thư Mục Quan Trọng

- `src/pages/Booking/`: Giao diện đặt lịch cho người dùng.
- `src/pages/Admin/Stats.tsx`: Trang quản trị và thống kê doanh thu.
- `src/services/booking/`: 
    - `BookingRepository.ts`: Xử lý logic nghiệp vụ và tương tác LocalStorage.
    - `types.ts`: Định nghĩa kiểu dữ liệu (TypeScript Interfaces).
- `config/`: Cấu hình hệ thống và Routing.

---

## 🎨 Điểm Nhấn Thiết Kế
- **Aesthetic UI:** Sử dụng Shadow mượt, Border-radius lớn (rounded-2xl), và hiệu ứng Hover sống động.
- **Gradient & Micro-animations:** Biểu đồ sử dụng Gradient Fill, các nút bấm có hiệu ứng Scale khi tương tác.
- **Responsive:** Tương thích tốt trên nhiều kích thước màn hình.

---
*Cập nhật lần cuối: 17-03-2026*
