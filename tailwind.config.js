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
    extend: {
      colors: {
        'run-red-1': '#ff1616',
        'run-red-2': '#ff5151',
      }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '0.5rem',
        sm: '1.5rem',
      },
    },
    screens: {
      // base: '0px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    backgroundImage: {
      'hero-tire': 'url("/assets/images/tire-hero.png")',
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
