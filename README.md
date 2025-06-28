# Low-Code Builder

Một ứng dụng low-code drag & drop builder với khả năng export ra code Next.js.

## Tính năng

- 🎨 **Drag & Drop Interface**: Kéo thả các component từ sidebar vào canvas
- 📦 **Component Library**: Thư viện component phong phú với các loại khác nhau
- ⚙️ **Property Panel**: Chỉnh sửa thuộc tính component một cách trực quan
- 👀 **Live Preview**: Xem trước kết quả ngay lập tức
- 📤 **Code Export**: Export ra code Next.js hoàn chỉnh
- 🎯 **TypeScript Support**: Hỗ trợ TypeScript
- 🎨 **Multiple Styling**: Tailwind CSS, Styled Components, CSS Modules

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Start production server
npm start
```

## Sử dụng

1. **Mở ứng dụng**: Truy cập `http://localhost:3000`
2. **Kéo thả components**: Từ sidebar bên trái vào canvas
3. **Chỉnh sửa thuộc tính**: Click vào component và chỉnh sửa trong panel bên phải
4. **Export code**: Click nút "Export" để tải về code Next.js

## Component Types

### Layout

- **Container**: Container với padding và styling
- **Card**: Card component với title và content

### Typography

- **Heading**: Heading với các level H1-H6
- **Paragraph**: Đoạn văn bản

### Interactive

- **Button**: Button với các variant và size
- **Form**: Form container
- **Input**: Input field với các type khác nhau

### Media

- **Image**: Image component

## Export Options

- **Framework**: Next.js, React
- **Styling**: Tailwind CSS, Styled Components, CSS Modules
- **Language**: TypeScript, JavaScript

## Cấu trúc dự án

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── Canvas.tsx         # Main canvas
│   ├── Sidebar.tsx        # Component library sidebar
│   ├── PropertyPanel.tsx  # Property editor
│   └── rendered/          # Rendered components
├── lib/                   # Utilities
│   ├── componentLibrary.ts # Component definitions
│   └── codeGenerator.ts   # Code generation logic
├── types/                 # TypeScript types
└── package.json           # Dependencies
```

## Công nghệ sử dụng

- **Next.js 14**: Framework React
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React DnD**: Drag and drop functionality
- **Lucide React**: Icons

## Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.
