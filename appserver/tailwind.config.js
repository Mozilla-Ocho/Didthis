/** @type {import('tailwindcss').Config} */

const colors = {
  'yellow-100': '#fffce3',
  'yellow-300': '#fff1a6',
  'yellow-500': '#f4c005',
  'yellow-600': '#877538',
  'yellow-700': '#42370E',
  'yellow-home': '#fff968',
  'yellow-home-light': 'rgba(255,255,255,0.8)',
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
        'links-hover': colors['yellow-600'],
        'links-active': colors['yellow-700'],
        'links-visited': colors['yellow-700'],

        // DRY_57530 button styles
        'primary-bg': colors['yellow-500'],
        'primary-bg-hover': colors['yellow-600'],
        'primary-bg-active': colors['yellow-700'],
        'primary-bg-disabled': colors['black-100'],
        'primary-txt': colors['black-700'],
        'primary-txt-hover': colors['white'],
        'primary-txt-active': colors['white'],
        'primary-txt-disabled': colors['black-300'],
        'secondary': colors['white'],
        'secondary-bg-hover': colors['white'],
        'secondary-bg-active': colors['white'],
        'secondary-bg-disabled': colors['white'],
        'secondary-txt': colors['yellow-700'],
        'secondary-txt-hover': colors['yellow-600'],
        'secondary-txt-active': colors['yellow-700'],
        'secondary-txt-disabled': colors['black-100'],
        'secondary-edge': colors['yellow-700'],
        'secondary-edge-hover': colors['yellow-600'],
        'secondary-edge-active': colors['yellow-700'],
        'secondary-edge-disabled': colors['black-100'],

        'form-borders': colors['black-300'],
        'form-labels': colors['black-300'],
        'form-toggle-bg': '#6750a4',

        'edges': colors['black-300'],
        'edges-light': colors['black-100'],

        'timestamps': colors['black-300'],
        'linkpreview-host': '#909090',

        'breadcrumbs': '#FFFCE3',

        'discordnag': '#EFFBFF',
        'trialaccountsignedup': '#EFFBFF',
        'trialaccountnag': colors['yellow-300'],
        'warning': colors['yellow-100'],
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
        '3xl2': ['30px','36px'], // midway btw the big jump from 3xl and 4xl...
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
        20: '80px',
        24: '96px',
        28: '112px',
        32: '128px',
        36: '144px',
        40: '160px',
        44: '176px',
        48: '192px',
        52: '208px',
        56: '224px',
        60: '240px',
        64: '256px',
        72: '288px',
        80: '320px',
        96: '384px',
      },
      typography: ({theme}) => ({ // prose, for legal pages
        DEFAULT: {
          css: {
            'line-height': 1.3,
             a: {
              color: theme('colors.links'),
              '&:hover': {
                color: theme('colors.links-hover'),
              },
              '&:active': {
                color: theme('colors.links-active'),
              },
              '&:visited': {
                color: theme('colors.links-visited'),
              },
            },
          }
        }
      }),
    },
  },
  plugins: [
    /* es lint for typescript doesn't like require() statements that result in
    * variables or functions that do things. however, this is actually how you
    * configure the forms plugin and this file is not an es2015 module */
    /* eslint-disable-next-line */
    require('@tailwindcss/forms')({strategy:'class'}),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
}
