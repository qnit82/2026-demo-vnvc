# Cẩm nang Chuẩn bị Phỏng vấn Front-end ReactJS (Target: VNVC)

Chào bạn, dựa trên bộ source code rất chuyên nghiệp mà bạn đã thực hiện, tôi đã đúc kết lộ trình chuẩn bị phỏng vấn sát thực tế nhất để giúp bạn tự tin "chinh chiến" tại VNVC.

## 1. Kiến thức ReactJS Trọng tâm (Dựa trên Codebase của bạn)

Bạn đang sử dụng React 19, điều này cho thấy bạn cập nhật công nghệ rất tốt. Hãy chuẩn bị kỹ các phần sau:

### A. Hooks & Performance Optimization
- **`useState` & `useEffect`**: Hiểu rõ vòng đời (lifecycle) và cách xử lý side-effects. Hỏi về "Cleanup function" trong `useEffect`.
- **`useCallback` & `useMemo`**: Trong dự án của bạn có dùng `useCallback` (ví dụ ở `RegistrationPage`). Bạn cần giải thích được: *Tại sao dùng nó ở đó? Khi nào dùng nó sẽ gây phản tác dụng (overhead)?*
- **`useRef`**: Bạn dùng để focus input. Hãy chuẩn bị nói về sự khác biệt giữa `useRef` và `useState` (không trigger re-render).

### B. State Management (Redux Toolkit)
- Tại sao chọn Redux Toolkit cho Global State (Auth)?
- Sự khác biệt giữa Slice, Action và Reducer.
- Khi nào dùng Local State (như bạn đang làm ở các trang nghiệp vụ) và khi nào đưa lên Redux?

### C. Form Handling & Validation
- Với các form phức tạp như `RegistrationPage`, bạn xử lý thế nào? (Bạn đang dùng Uncontrolled kết hợp Controlled component).
- Cách tối ưu hiệu suất khi form có quá nhiều fields (tránh re-render toàn bộ form khi chỉ gõ 1 ký tự).

---

## 2. Kỹ năng Front-end "Premium" (Thế mạnh dự án của bạn)

Tại VNVC, họ sẽ đánh giá cao khả năng làm sản phẩm "chỉn chu" và "thực tế":

- **Tailwind CSS & Design System**: Cách bạn xây dựng giao diện Dark Mode, tính nhất quán của UI.
- **i18n (Internationalization)**: Tại sao dự án y tế cần đa ngôn ngữ? Cách quản lý tệp dịch hiệu quả.
- **Keyboard Shortcuts**: Giải thích lý do bạn thêm F1, F2... (Tối ưu cho nhân viên y tế thao tác nhanh khi đông khách).
- **Responsive Design**: Đảm bảo hệ thống chạy tốt trên bảng điều khiển (bác sĩ dùng tablet) và máy tính để bàn.

---

## 3. Tư duy Nghiệp vụ (Business Mindset) - "Điểm cộng tuyệt đối"

Vì bạn phỏng vấn ở VNVC, hãy chuẩn bị nói về:

1.  **Cơ chế FEFO (First Expired, First Out)**: Đây là logic cực kỳ quan trọng trong quản lý vaccine. Hãy giải thích cách bạn code để hệ thống tự gợi ý lô hàng sắp hết hạn trước.
2.  **Xử lý hàng đợi (Real-time Queue)**: Cách bạn dùng Polling (tự động fetch mỗi 30s) để cập nhật danh sách chờ khám/tiêm.
3.  **An toàn dữ liệu**: Cách bạn handle lỗi 401, bảo mật Token trong LocalStorage/Cookies.
4.  **Tính chính xác**: Trong y tế, sai một con số là nguy hiểm. Bạn đã làm gì để validate dữ liệu chặt chẽ?

---

## 4. Lộ trình Học tập & Nâng cao (Tư vấn thêm)

Để tiến xa hơn trong sự nghiệp Front-end, bạn nên bổ sung:

-   **TypeScript**: Đây là xu hướng bắt buộc. Nó giúp giảm thiểu bug do sai kiểu dữ liệu (rất quan trọng cho ngành y tế).
-   **Unit Testing (Vitest/Jest)**: Học cách viết test cho các hàm xử lý logic (như tính tuổi, logic FEFO).
-   **Performance Monitoring**: Cách dùng Chrome DevTools (Lighthouse, Profiler) để đo tốc độ tải trang.
-   **Next.js**: Cung cấp SSR (Server Side Rendering) giúp lên SEO tốt hơn cho các trang tin tức của VNVC.

## 5. Các câu hỏi phỏng vấn thường gặp (Sát sườn)

1.  *Làm thế nào để tối ưu một trang React có danh sách khách hàng rất lớn (ví dụ 10,000 người)?* (Gợi ý: Virtual List, Pagination).
2.  *Bạn xử lý lỗi mạng hoặc API chậm như thế nào để người dùng không cảm thấy khó chịu?* (Gợi ý: Loading states, Skeleton, Toast notifications).
3.  *Phân biệt `useLayoutEffect` và `useEffect`.*
4.  *Tại sao bạn lại chọn Vite thay vì Create React App?*

**Lời khuyên cuối**: Hãy tự tin vì bộ code của bạn có độ hoàn thiện rất cao. Hãy nhấn mạnh vào việc bạn hiểu **User Experience (UX)** của nhân viên y tế và **Business Logic** của ngành tiêm chủng.

Chúc bạn có một buổi phỏng vấn thành công rực rỡ tại VNVC!
