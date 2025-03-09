import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#0A0F1E',
        color: 'whiteAlpha.900',
        lineHeight: 'tall',
      },
    },
  },
  colors: {
    brand: {
      primary: '#2D5FF5',
      secondary: '#0EA5E9',
      accent: '#7928CA',
      dark: {
        100: '#1A1F35',
        200: '#151929',
        300: '#0F1220',
        400: '#0A0F1E',
      },
      glow: {
        primary: 'rgba(45, 95, 245, 0.15)',
        secondary: 'rgba(14, 165, 233, 0.15)',
        accent: 'rgba(121, 40, 202, 0.15)',
      },
    },
  },
  components: {
    Card: {
      baseStyle: {
        container: {
          bg: 'brand.dark.100',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '2xl',
          border: '1px solid',
          borderColor: 'whiteAlpha.100',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          transition: 'all 0.3s ease-in-out',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.5)',
            borderColor: 'whiteAlpha.200',
          },
        },
      },
    },
    Button: {
      variants: {
        glass: {
          bg: 'whiteAlpha.50',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid',
          borderColor: 'whiteAlpha.100',
          _hover: {
            bg: 'whiteAlpha.100',
            borderColor: 'whiteAlpha.200',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          },
        },
        gradient: {
          bgGradient: 'linear(to-r, brand.primary, brand.secondary)',
          color: 'white',
          fontWeight: '600',
          border: '1px solid',
          borderColor: 'whiteAlpha.200',
          boxShadow: '0 4px 20px rgba(45, 95, 245, 0.3)',
          _hover: {
            bgGradient: 'linear(to-r, #3D6FFF, #1EB5F9)',
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 25px rgba(45, 95, 245, 0.4)',
          },
          _active: {
            transform: 'translateY(0)',
            boxShadow: '0 4px 15px rgba(45, 95, 245, 0.2)',
          },
        },
        outline: {
          border: '1px solid',
          borderColor: 'whiteAlpha.200',
          color: 'whiteAlpha.900',
          _hover: {
            bg: 'whiteAlpha.50',
            borderColor: 'whiteAlpha.300',
          },
        },
      },
    },
    Link: {
      baseStyle: {
        _hover: {
          textDecoration: 'none',
        },
      },
    },
    Heading: {
      baseStyle: {
        color: 'whiteAlpha.900',
        letterSpacing: 'tight',
      },
    },
    Text: {
      baseStyle: {
        color: 'whiteAlpha.800',
      },
    },
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

export default theme; 