const colors = require("tailwindcss/colors");
module.exports = {

  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          //remove default style syntax hightligh
          css: {
            pre: null,
            code:null,
            'code::before': null,
            'code::after': null,
          },
        },
      },
    },
    colors
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
