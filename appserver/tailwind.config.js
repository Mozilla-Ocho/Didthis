/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'yellow-100': '#fffce3',
        'yellow-300': '#fff1a6',
        'yellow-500': '#f4c005',
        'yellow-700': '#5F4D20',
        'black-100': '#E6E6E6',
        'black-300': '#757470',
        'black-500': '#47453E',
        'black-700': '#2C2727',
        white: '#ffffff',
        'charcoal-main': '#0d0d0d',
        'charcoal-light': '#3d3d3d',
        'gl-black': '#1f1f1f',
        links: '#5F4D20', // yellow 700
        'links-hover': '#f4c005', // yellow 500
        'links-active': '#bb0000',
        'links-visited': '#5F4D20', // yellow 700
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontSize: {
        bxl: ['24px','28px'],
        bl: ['20px','26px'],
        bm: ['16px','24px'],
        bs: ['14px','22px'],
        h1: ['64px','82px'],
        h2: ['48px','62px'],
        h3: ['36px','46px'],
        h4: ['24px','28px'],
        h5: ['20px','24px'],
      },
      spacing: {
        px: '1px',
        0: '0',
        0.5: '2px',
        1: '4px',
        1.5: '6px',
        2: '8px',
        2.5: '10px',
        3: '12px',
        3.5: '14px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
        11: '44px',
        12: '48px',
        14: '52px',
        16: '56px',
        20: '60px',
        24: '64px',
        28: '68px',
        32: '72px',
        36: '76px',
        40: '80px',
        44: '84px',
        48: '88px',
        52: '92px',
        56: '96px',
        60: '100px',
        64: '104px',
        72: '108px',
        80: '112px',
        96: '116px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
