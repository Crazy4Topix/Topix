/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './app/(app)/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
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
        primary_thin: ['Poppins_100Thin'],
        primary_thin_italic: ['Poppins_100Thin_Italic'],
        primary_extra_light: ['Poppins_200ExtraLight'],
        primary_extra_light_italic: ['Poppins_200ExtraLight_Italic'],
        primary_light: ['Poppins_300Light'],
        primary_light_italic: ['Poppins_300Light_Italic'],
        primary: ['Poppins_400Regular'],
        primary_italic: ['Poppins_400Regular_Italic'],
        primary_medium: ['Poppins_500Medium'],
        primary_medium_italic: ['Poppins_500Medium_Italic'],
        primary_semi_bold: ['Poppins_600SemiBold'],
        primary_semi_bold_italic: ['Poppins_600SemiBold_Italic'],
        primary_bold: ['Poppins_700Bold'],
        primary_bold_italic: ['Poppins_700Bold_Italic'],
        primary_extra_bold: ['Poppins_800ExtraBold'],
        primary_extra_bold_italic: ['Poppins_800ExtraBold_Italic'],
        primary_black: ['Poppins_900Black'],
        primary_black_italic: ['Poppins_900Black_Italic'],
      },
    },
  },
  plugins: [],
};
