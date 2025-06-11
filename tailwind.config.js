/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",            // root directory ke HTML files
    "./src/**/*.{html,js}" // agar src folder hai to uske andar ke HTML/JS
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
