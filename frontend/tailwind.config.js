/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "black",
        primary: "rgb(74 222 128)", // green-400
        secondary: "rgb(75 85 99)", // gray-600
      },
    },
  },
  plugins: [],
};
