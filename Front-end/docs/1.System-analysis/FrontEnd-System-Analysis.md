# System FrontEnd Analysis

## 1. Business Analysis

Hệ thống được thiết kế để quản lý quy trình tiêm chủng khép kín, đảm bảo tính chuyên nghiệp và an toàn y tế. Các luồng nghiệp vụ chính bao gồm:

### A. Quy trình Khách hàng (Patient Journey)
1.  **Đăng ký (Registration)**:
    -   Hệ thống hỗ trợ đăng ký mới hoặc tìm kiếm khách hàng cũ từ cơ sở dữ liệu.
    -   Form đăng ký thông minh: Tự động yêu cầu thông tin người giám hộ nếu khách hàng dưới 18 tuổi.
    -   Tích hợp tìm kiếm địa chỉ (Phường/Xã) và gợi ý vaccine phù hợp.
2.  **Khám sàng lọc (Screening)**:
    -   Quản lý hàng đợi (Queue) theo thời gian thực.
    -   Bác sĩ ghi nhận chỉ số sinh tồn (nhiệt độ, huyết áp, cân nặng...).
    -   Đánh giá lâm sàng và đưa ra chỉ định tiêm chủng (Đủ điều kiện hoặc Tạm hoãn).
3.  **Thanh toán (Payment)**:
    -   Xuất hóa đơn dựa trên chỉ định của bác sĩ.
    -   Hỗ trợ nhiều phương thức (Tiền mặt, Chuyển khoản).
    -   Hỗ trợ xem trước và in phiếu thu chuyên nghiệp.
4.  **Tiêm chủng (Injection)**:
    -   Điều dưỡng thực hiện tiêm dựa trên danh sách chờ từ phòng khám.
    -   **Cơ chế FEFO (First Expired, First Out)**: Hệ thống tự động gợi ý lô hàng có hạn sử dụng gần nhất để sử dụng trước.
    -   Ghi nhận vị trí tiêm (tay trái, tay phải...) để theo dõi phản ứng sau tiêm.

### B. Quản trị và Vận hành (Operations)
-   **Quản lý Kho (Inventory)**: Theo dõi tồn kho theo lô (Batch), cảnh báo tồn kho thấp và hàng sắp hết hạn. Hỗ trợ nhập kho thủ công hoặc từ file Excel.
-   **Báo cáo & Thống kê (Reports)**:
    -   Theo dõi doanh thu, lượt khách, tỉ lệ phản ứng sau tiêm.
    -   **Phễu khách hàng (Funnel)**: Phân tích tỉ lệ chuyển đổi từ Đăng ký -> Khám -> Thanh toán -> Tiêm.
    -   Thống kê Top vaccine được sử dụng nhiều nhất.
-   **Dashboard**: Tổng quan các chỉ số vận hành trong ngày và các cảnh báo nghiệp vụ (Alerts).

---

## 2. Thiết kế Hệ thống (System Design)

### A. Kiến trúc Frontend
-   **Framework**: React 19 (Vite) - Đảm bảo tốc độ render và tối ưu hóa build.
-   **Quản lý Trạng thái (State Management)**: 
    -   Sử dụng **Redux Toolkit** cho các trạng thái toàn cục (Authentication).
    -   Sử dụng **React Hooks (useState, useEffect)** kết hợp với Local State cho các module nghiệp vụ cụ thể để tăng tính modular.
-   **Giao tiếp API**: Sử dụng **Axios** với cơ chế Interceptors để tự động gắn Bearer Token và xử lý lỗi tập trung (401 Unauthorized).

### B. UI/UX Design
-   **Style**: Sử dụng **Tailwind CSS** với phong cách Dark Mode cao cấp, hiện đại (Professional Dark Theme).
-   **Component Library**: Xây dựng bộ component dùng chung (AppDialogs, CustomerList, VaccineSelector...) đảm bảo tính nhất quán.
-   **Iconography**: Sử dụng **Lucide React** - bộ icon vector sắc nét và đồng bộ.
-   **Đa ngôn ngữ**: Tích hợp **i18next** (Tiếng Việt & Tiếng Anh).
-   **Tính tương tác (Interactivity)**: 
    -   Hỗ trợ phím tắt bàn phím (F1, F2, Enter) tối ưu cho nhân viên y tế thao tác nhanh.
    -   Micro-animations và transitions mượt mà (Fade-in, Slide-in).

### C. Tính năng Kỹ thuật Đặc sắc
-   **Autocomplete thông minh**: Tìm kiếm Phường/Xã và Vaccine với tốc độ cao.
-   **Real-time Queue**: Cơ chế tự động làm mới hàng đợi (polling) mỗi 30 giây.
-   **Xử lý Excel**: Module nhập kho thông minh hỗ trợ đọc file bảng tính.
-   **Hỗ trợ In ấn**: CSS Media Queries (`@media print`) được tối ưu cho việc in phiếu thu chuẩn xác.

---
**Kết luận**: Đây là một bộ source codeFront-end hoàn chỉnh, mô phỏng chính xác nghiệp vụ thực tế tại các trung tâm tiêm chủng lớn như VNVC, với sự đầu tư kỹ lưỡng về cả mặt logic nghiệp vụ lẫn trải nghiệm người dùng.
