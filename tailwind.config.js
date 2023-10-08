/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        "card-classroom-img": "202px",
        "900px": "900px",
        "90per": "90%",
        "45vh": "45vh",
        "48vh": "48vh",
        "50vh": "50vh",
        "58vh": "58vh",
        "60vh": "60vh",
        "62vh": "62vh",
        "65vh": "65vh",
        "70vh": "70vh",
        "72vh": "72vh",
        "75vh": "75vh",
        "80vh": "80vh",
        "90vh": "90vh",
      },
      width: {
        "card-classroom-img": "358px",
        "90per": "90%",
        "60vw": "60vw",
        "80vw": "80vw",
      },
      backgroundImage: {
        "signin-pattern": "url('/src/assets/images/sign-in-bg.jpg')",
      },
    },
  },
  plugins: [],
};
