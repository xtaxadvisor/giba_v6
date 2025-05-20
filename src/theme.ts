import { extendTheme } from '@chakra-ui/react';

export const chakraTheme = extendTheme({
  colors: {
    brand: {
      50: '#f5faff',
      100: '#dceeff',
      200: '#99ccff',
      300: '#66b3ff',
      400: '#3399ff',
      500: '#0077cc',
      600: '#006bb3',
      700: '#005c99',
      800: '#004d80',
      900: '#003366',
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'gray.800',
      },
    },
  },
});