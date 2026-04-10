# Ghi chú thay đổi `Lesson.js`

## Mục tiêu

Tài liệu này ghi lại chi tiết các thay đổi đã thực hiện cho trang bài học trong quá trình sửa lỗi video không hiển thị, chuẩn bị hỗ trợ nhiều URL video, theo dõi tiến độ học, và sửa lỗi hiển thị tiếng Việt.

## File đã thay đổi

- `src/components/Content/Lesson.js`
- `src/App.css`

## 1. Sửa lỗi video không hiển thị

### Vấn đề

Project đang dùng `react-player@3.4.0`, nhưng component cũ truyền prop `url`.

Ở `react-player` bản 3, prop đúng để truyền video là `src`. Khi dùng `url`, player không nhận được nguồn phát nên video không hiện.

### Đã thay đổi

- Đổi từ:

```jsx
<ReactPlayer url="..." />
```

- Sang:

```jsx
<ReactPlayer src="..." />
```

### Kết quả

- Video YouTube có thể render lại bình thường bằng `ReactPlayer`.

## 2. Chuẩn bị cho nhiều video thay vì hardcode 1 URL

### Trước khi sửa

`Lesson.js` chỉ chứa một video URL cố định trong JSX.

Điều này gây khó mở rộng khi có nhiều bài học hoặc cần lấy dữ liệu từ backend/user input.

### Đã thay đổi

Tạo dữ liệu bài học mẫu trong `initialLessons`:

```js
const initialLessons = [
  {
    id: 1,
    section: 'Section 3.1',
    title: 'Overview of VLANs',
    videoUrl: '...',
    completed: true
  }
];
```

### Mục đích

- Tách dữ liệu khỏi UI
- Dễ thay bằng dữ liệu từ API/database sau này
- Hỗ trợ hàng trăm video mà không phải sửa JSX từng bài

## 3. Thêm cơ chế chọn bài học đang xem

### Đã thay đổi

Thêm state:

```js
const [selectedLessonId, setSelectedLessonId] = useState(2);
const [lessons, setLessons] = useState(initialLessons);
```

và dùng `useMemo` để lấy bài học hiện tại:

```js
const selectedLesson = useMemo(
  () => lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0],
  [lessons, selectedLessonId]
);
```

### Kết quả

- Sidebar trái giờ hiển thị danh sách bài học từ dữ liệu
- Bấm vào từng bài sẽ đổi video tương ứng
- Tiêu đề bài học ở topbar và phần nội dung được cập nhật theo bài đang chọn

## 4. Hỗ trợ URL người dùng nhập dưới nhiều dạng

### Nhu cầu

Người dùng có thể dán:

- URL YouTube dạng `watch?v=...`
- URL dạng `embed/...`
- Cả đoạn HTML `<iframe ... src="..."></iframe>`

### Đã thay đổi

Thêm hàm:

```js
const extractIframeSrc = (value) => {
  const match = value.match(/src=["']([^"']+)["']/i);
  return match ? match[1] : value;
};
```

và:

```js
const normalizeVideoUrl = (value) => {
  if (!value) return '';
  const trimmed = extractIframeSrc(value.trim());
  return trimmed;
};
```

### Mục đích

- Nếu user dán cả đoạn `iframe`, hệ thống vẫn lấy được URL video thực tế
- Giảm lỗi do định dạng đầu vào không đồng nhất
- Chuẩn bị tốt hơn cho dữ liệu nhập từ người dùng

## 5. Thêm state theo dõi tiến độ học video

### Đã thay đổi

Tạo cấu trúc tiến độ mặc định:

```js
const defaultProgressState = () => ({
  played: 0,
  playedSeconds: 0,
  loaded: 0,
  loadedSeconds: 0,
  completed: false
});
```

Khởi tạo `lessonProgress` theo từng bài:

```js
const [lessonProgress, setLessonProgress] = useState(() =>
  initialLessons.reduce((accumulator, lesson) => {
    accumulator[lesson.id] = {
      ...defaultProgressState(),
      completed: lesson.completed
    };
    return accumulator;
  }, {})
);
```

### Dữ liệu đang lưu

Mỗi bài học hiện có thể giữ:

- `played`: tỷ lệ đã xem từ `0` đến `1`
- `playedSeconds`: số giây đã xem
- `loaded`: tỷ lệ đã tải
- `loadedSeconds`: số giây đã tải
- `completed`: đã hoàn thành hay chưa

## 6. Gắn các event của `ReactPlayer`

### Đã thay đổi

`ReactPlayer` hiện có:

```jsx
<ReactPlayer
  src={normalizeVideoUrl(selectedLesson.videoUrl)}
  onPlay={() => handlePlay(selectedLesson.id)}
  onPause={() => handlePause(selectedLesson.id)}
  onEnded={() => handleEnded(selectedLesson.id)}
  onProgress={(state) => handleProgress(selectedLesson.id, state)}
/>
```

### Ý nghĩa từng handler

#### `handlePlay`

- Ghi log bài học đang bắt đầu phát
- Có thể thay bằng API ghi nhận `started_at`

#### `handlePause`

- Ghi log thời điểm dừng video
- Có thể dùng để lưu checkpoint

#### `handleEnded`

- Đánh dấu bài học hoàn thành
- Set `played = 1`
- Set `completed = true`
- Cập nhật cả `lessonProgress` và `lessons`

#### `handleProgress`

- Cập nhật tiến độ xem theo callback của `ReactPlayer`
- Khi `played >= 0.95`, tự đánh dấu hoàn thành
- Đây là chỗ phù hợp nhất để debounce và gọi API lưu tiến độ học

## 7. Thêm hiển thị tiến độ trực tiếp trên giao diện

### Đã thay đổi

Thêm một khối thông tin:

- Phần trăm đã xem
- Số giây đã xem
- Trạng thái `Hoàn thành` hoặc `Đang học`

Ví dụ hiển thị:

```txt
Đã xem: 50% | Thời gian xem: 120s | Trạng thái: Đang học
```

### Mục đích

- Dễ kiểm tra event `onProgress`
- Dễ nhìn thấy state thay đổi ngay trên giao diện
- Thuận tiện khi test trước khi nối backend

## 8. Cập nhật progress bar ở sidebar

### Đã thay đổi

Thanh tiến độ trên sidebar trái không còn là giá trị cố định nữa.

Nó được tính từ:

```js
const completedCount = lessons.filter((lesson) => lessonProgress[lesson.id]?.completed).length;
const progressPercent = lessons.length ? (completedCount / lessons.length) * 100 : 0;
```

và render bằng:

```jsx
style={{ width: `${progressPercent}%` }}
```

### Kết quả

- Khi hoàn thành bài học, progress bar sẽ tăng theo số bài hoàn tất

## 9. Dọn lại các phần tử button/link

### Vấn đề cũ

Trong sidebar phải có các thẻ:

```html
<a href="#">
```

Điều này gây warning accessibility trong build.

### Đã thay đổi

Đổi các mục tài liệu đính kèm từ `<a href="#">` sang:

```jsx
<button type="button" className="rs-resource-item">
```

### Kết quả

- Loại bỏ warning liên quan `href="#"`
- HTML phù hợp hơn với hành vi hiện tại

## 10. Sửa lỗi tiếng Việt bị vỡ mã hóa

### Vấn đề

Nội dung trong `Lesson.js` bị lỗi encoding nên hiển thị dạng:

- `TrÆ°á»›c`
- `TÃ i nguyÃªn`
- `Viáº¿t ghi chÃº...`

Đây không phải lỗi font đơn thuần mà là lỗi chuỗi text bị sai mã hóa.

### Đã thay đổi

Thay toàn bộ text tiếng Việt lỗi bằng Unicode chuẩn, ví dụ:

- `Trước`
- `Tiếp theo`
- `Tài nguyên & Ghi chú`
- `Ghi chú cá nhân`
- `Thảo luận bài học`
- Nội dung mô tả VLAN

### Kết quả

- Chữ tiếng Việt hiển thị đúng
- Không còn hiện tượng chữ bị vỡ ký tự

## 11. Sửa cấu hình font toàn cục

### Đã thay đổi trong `src/App.css`

Thêm import `Inter` từ Google Fonts:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
```

Đổi:

```css
body {
  font-family: 'Inter', sans-serif;
}
```

thành:

```css
body {
  font-family: 'Inter', var(--system-ui);
}
```

và thêm:

```css
button,
input,
textarea,
select {
  font: inherit;
}
```

### Mục đích

- Đảm bảo toàn bộ giao diện dùng cùng hệ font
- Tránh việc `button`, `textarea`, `input` tự dùng font mặc định khác với `body`
- Cải thiện đồng nhất giao diện

## 12. Kiểm tra build

### Đã thực hiện

Chạy build bằng:

```bash
npm.cmd run build
```

trong môi trường tạm với `TEMP` trỏ vào `.tmp` trong project do sandbox không cho truy cập thư mục temp mặc định của user.

### Kết quả

- Build thành công
- Không có lỗi compile liên quan đến `Lesson.js`
- Chỉ còn warning cũ ở:
  - `src/components/Content/Profile.js`
  - `src/components/Content/Roadmap.js`

Các warning này không do phần thay đổi của trang lesson gây ra.

## 13. Thư mục tạm `.tmp`

### Giải thích

Trong quá trình build, đã tạo thư mục `.tmp` tạm thời để Node dùng làm temp directory trong sandbox.

### Trạng thái hiện tại

- Thư mục `.tmp` đã được xóa
- Không còn tồn tại trong project

## 14. Hướng phát triển tiếp theo

Nếu muốn nối sang backend thực tế, các bước tiếp theo nên là:

1. Lấy danh sách bài học từ API thay vì `initialLessons`
2. Thay `console.log` trong `handlePlay`, `handlePause`, `handleEnded`, `handleProgress` bằng request API
3. Debounce `handleProgress` để tránh gửi request quá nhiều
4. Lưu `playedSeconds`, `completed`, `lastWatchedAt` theo `userId + lessonId`
5. Khi mở lại bài học, truyền vị trí cũ vào player để resume

## 15. Tóm tắt ngắn

Các thay đổi chính đã hoàn thành:

- Sửa `ReactPlayer` từ `url` sang `src`
- Hỗ trợ dữ liệu nhiều bài học
- Hỗ trợ nhận URL từ user, kể cả trường hợp dán `iframe`
- Bắt event `onPlay`, `onPause`, `onEnded`, `onProgress`
- Tự cập nhật tiến độ và đánh dấu hoàn thành
- Sửa toàn bộ tiếng Việt bị lỗi mã hóa
- Chuẩn hóa font toàn cục bằng `Inter`
- Build kiểm tra thành công
