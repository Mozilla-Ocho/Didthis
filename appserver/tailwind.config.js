/** @type {import('tailwindcss').Config} */

const colors = {
  'yellow-100': '#fffce3',
  'yellow-300': '#fff1a6',
  'yellow-500': '#f4c005',
  'yellow-700': '#5F4D20',
  'yellow-home': 'rgb(254,249,127)',
  'yellow-home-light': 'rgb(255,254,228)',
  'black-100': '#E6E6E6',
  'black-300': '#757470',
  'black-500': '#47453E',
  'black-700': '#2C2727',
  white: '#ffffff',
  'charcoal-main': '#0d0d0d',
  'charcoal-light': '#3d3d3d',
  'gl-black': '#1f1f1f',
}

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        'bodytext': colors['black-700'],
        links: colors['yellow-700'],
        'links-hover': colors['yellow-700'],
        'links-active': '#bb0000',
        'links-visited': colors['yellow-700'],

        'primary-bg': colors['yellow-500'],
        'primary-bg-hover': colors['yellow-300'],
        'primary-bg-active': colors['yellow-700'],
        'primary-bg-disabled': colors['black-100'],
        'primary-txt': colors['black-700'],
        'primary-txt-hover': colors['black-700'],
        'primary-txt-active': colors['black-100'],
        'primary-txt-disabled': colors['black-300'],

        'secondary': colors['white'],
        'secondary-bg-hover': colors['white'],
        'secondary-bg-active': colors['white'],
        'secondary-bg-disabled': colors['white'],
        'secondary-txt': colors['black-700'],
        'secondary-txt-hover': colors['black-300'],
        'secondary-txt-active': colors['black-700'],
        'secondary-txt-disabled': colors['black-100'],
        'secondary-edge': colors['black-700'],
        'secondary-edge-hover': colors['black-300'],
        'secondary-edge-disabled': colors['black-100'],

        'form-borders': colors['black-300'],
        'form-labels': colors['black-300'],
        'form-toggle-bg': '#6750a4',

        'edges': colors['black-300'],
        'edges-light': colors['black-100'],

        'timestamps': '#909090',
        'linkpreview-host': '#909090',

        'breadcrumbs': '#FFFCE3',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontSize: {
        // for body text. we need to use tailwind's naming conventions for
        // twMerge to work well.
        sm: ['14px','22px'],    // S in mocks
        base: ['16px','24px'],  // M in mocks
        lg: ['20px','26px'],    // L in mocks
        xl: ['24px','28px'],    // XL in mocks
        // for headers, likewise we stick to names that twMerge knows about.
        '2xl': ['20px','24px'], // H5 in mocks
        '3xl': ['24px','28px'], // H4 in mocks
        '4xl': ['36px','46px'], // H3 in mocks
        '5xl': ['48px','62px'], // H2 in mocks
        '6xl': ['64px','82px'], // H1 in mocks
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
  plugins: [
    /* es lint for typescript doesn't like require() statements that result in
    * variables or functions that do things. however, this is actually how you
    * configure the forms plugin and this file is not an es2015 module */
    /* eslint-disable-next-line */
    require('@tailwindcss/forms')({strategy:'class'}),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
}
