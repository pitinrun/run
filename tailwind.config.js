// tailwind.config.js
/** @type {import('tailwindcss').Config} */

module.exports = {
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#ff1616',
          // secondary: '#f6d860',
          // accent: '#37cdbe',
          neutral: '#3d4451',
          'base-100': '#ffffff',
        },
      },
      // 'dark',
      // 'cupcake',
    ],
  },
  theme: {
    container: {
      center: true,
    },
    screens: {
      // base: '0px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  purge: ['./app/**/*.tsx', './components/**/*.tsx'],
  darkMode: false,
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
    fontSize: ['responsive', 'hover', 'focus', 'active'],
    padding: ['responsive', 'hover', 'focus', 'active'],
    margin: ['responsive', 'hover', 'focus', 'active'],
    align: ['responsive', 'hover', 'focus', 'active'],
  },
  plugins: [require('daisyui')],
};
