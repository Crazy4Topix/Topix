/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './app/(app)/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00DEAD',
        'primary-text': '#050506',
        background: '#f4f5f6',
        secondary: '#c7ced1',
        accent: '#3c82c8',
      },
      fontFamily: {
        primary: ['Poppins'],
        Poppins_100_thin: ['Poppins_100Thin'],
        Poppins_100_thin_italic: ['Poppins_100Thin_Italic'],
        Poppins_200_extra_light: ['Poppins_200ExtraLight'],
        Poppins_200_extra_light_italic: ['Poppins_200ExtraLight_Italic'],
        Poppins_300_light: ['Poppins_300Light'],
        Poppins_300_light_italic: ['Poppins_300Light_Italic'],
        Poppins_400_regular: ['Poppins_400Regular'],
        Poppins_400_regular_italic: ['Poppins_400Regular_Italic'],
        Poppins_500_medium: ['Poppins_500Medium'],
        Poppins_500_medium_italic: ['Poppins_500Medium_Italic'],
        Poppins_600_semi_bold: ['Poppins_600SemiBold'],
        Poppins_600_semi_bold_italic: ['Poppins_600SemiBold_Italic'],
        Poppins_700_bold: ['Poppins_700Bold'],
        Poppins_700_bold_italic: ['Poppins_700Bold_Italic'],
        Poppins_800_extra_bold: ['Poppins_800ExtraBold'],
        Poppins_800_extra_bold_italic: ['Poppins_800ExtraBold_Italic'],
        Poppins_900_black: ['Poppins_900Black'],
        Poppins_900_black_italic: ['Poppins_900Black_Italic'],
      },
    },
  },
  plugins: [],
};
