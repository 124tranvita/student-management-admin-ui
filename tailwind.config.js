/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        "card-classroom-img": "202px",
        "90per": "90%",
        "50vh": "50vh",
        "60vh": "60vh",
        "62vh": "62vh",
        "65vh": "65vh",
        "70vh": "70vh",
        "75vh": "75vh",
        "80vh": "80vh",
      },
      width: {
        "card-classroom-img": "358px",
        "60vw": "60vw",
        "80vw": "80vw",
      },
      backgroundImage: {
        "signin-pattern": "url('/src/assets/images/sign-in-bg.webp')",
      },
    },
  },
  plugins: [],
};
