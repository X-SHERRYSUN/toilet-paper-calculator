/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 根據你的專案調整 (JS: "./src/**/*.{js,jsx}")
  ],
  theme: {
    extend: {
      // 在這裡加入你的自訂主題，例如之前的顏色
      colors: {
        'custom-pink': '#FF68A1',
      },
    },
  },
  plugins: [],
}