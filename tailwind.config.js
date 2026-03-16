/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Quét tất cả file React trong thư mục src
  ],
  theme: {
    extend: {
      // Bạn có thể thêm màu sắc tùy chỉnh cho Monkey English ở đây
      colors: {
        monkey: {
          primary: "#2563eb",
          secondary: "#1e40af",
          accent: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};
