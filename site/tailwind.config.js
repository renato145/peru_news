const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./scr/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        lime: colors.lime,
        green: colors.green
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
