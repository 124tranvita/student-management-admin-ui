/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        "card-classroom-img": "202px",
        "70vh": "70vh",
      },
      width: {
        "card-classroom-img": "358px",
      },
    },
  },
  plugins: [],
};
