# Cấu trúc dự án Movie App

## Tổng quan

Dự án đã được refactor để tuân theo các best practices của React và có cấu trúc chuyên nghiệp hơn.

## Cấu trúc thư mục

```
src/
├── components/           # Các component tái sử dụng
│   ├── Background/      # Component background
│   ├── ErrorBoundary/   # Xử lý lỗi
│   ├── Header/          # Header navigation
│   ├── Hero/            # Hero section
│   ├── Loading/         # Loading component
│   └── MovieThumbnails/ # Movie thumbnails
├── constants/           # Các hằng số
├── hooks/              # Custom hooks
├── pages/              # Các trang
├── utils/              # Utility functions
└── theme/              # Theme configuration
```

## Các cải tiến chính

### 1. Component Architecture

- **Tách component**: Tách component lớn thành các component nhỏ, dễ quản lý
- **Single Responsibility**: Mỗi component có một trách nhiệm cụ thể
- **Reusability**: Các component có thể tái sử dụng

### 2. Custom Hooks

- **useMovies**: Quản lý dữ liệu phim
- **useScroll**: Quản lý scroll state

### 3. Performance Optimization

- **React.memo**: Tối ưu re-render
- **useCallback**: Tối ưu function references
- **useMemo**: Tối ưu expensive calculations

### 4. Error Handling

- **ErrorBoundary**: Xử lý lỗi toàn cục
- **Loading States**: Hiển thị trạng thái loading
- **PropTypes**: Validation props

### 5. Code Organization

- **Constants**: Tập trung các hằng số
- **Utils**: Các function tiện ích
- **Index files**: Export/import rõ ràng

## Cách sử dụng

### Import components

```jsx
import Header from "../components/Header";
import Hero from "../components/Hero";
import MovieThumbnails from "../components/MovieThumbnails";
```

### Sử dụng custom hooks

```jsx
import useMovies from "../hooks/useMovies";
import useScroll from "../hooks/useScroll";

const movies = useMovies();
const scrolled = useScroll();
```

### Sử dụng constants

```jsx
import { NAV_ITEMS, THUMB_SIZE, COLORS } from "../constants";
```

## Best Practices được áp dụng

1. **Component Composition**: Sử dụng composition thay vì inheritance
2. **Props Validation**: Sử dụng PropTypes để validate props
3. **Error Boundaries**: Xử lý lỗi gracefully
4. **Performance**: Tối ưu với memo, useCallback, useMemo
5. **Accessibility**: Thêm aria-labels và semantic HTML
6. **Code Splitting**: Tách code thành các module nhỏ
7. **Consistent Naming**: Đặt tên nhất quán
8. **Documentation**: Comment và README rõ ràng

## Lợi ích

- **Maintainability**: Dễ bảo trì và mở rộng
- **Testability**: Dễ test từng component riêng biệt
- **Performance**: Tối ưu hiệu suất
- **Developer Experience**: Dễ phát triển và debug
- **Scalability**: Dễ mở rộng khi dự án lớn hơn
