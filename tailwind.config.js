/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        
        sans: ['Fredoka', 'sans-serif'],
        
        funny: ['"Luckiest Guy"', 'cursive'],
        
        soft: ['Fredoka', 'sans-serif'],
      },
    },
  },
  plugins: [],
}