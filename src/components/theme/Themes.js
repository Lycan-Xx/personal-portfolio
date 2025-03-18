import { createTheme, responsiveFontSizes } from '@mui/material';
import Settings from '../../settings/settings.json';

const { primary, secondary, black, white } = Settings.colors;

// Shared theme configuration
const baseTheme = {
  typography: {
    fontFamily: "'Inter', 'Roboto Mono', monospace",
    fontSize: 16,
    htmlFontSize: 16,
    h1: { fontWeight: 500 },
    h2: { fontWeight: 500 },
    h3: { fontWeight: 500 },
    h5: {
      fontWeight: 500,
      fontFamily: 'Roboto Mono, monospace',
    },
    body: {
      fontWeight: 500,
      fontFamily: 'Roboto Mono, monospace',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'all 0.5s ease',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
          '&:hover': {
            backgroundColor: primary,
          },
          transition: 'all 0.5s ease',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          width: '2.5rem',
          height: '2.5rem',
          fontSize: '1.25rem',
        },
        primary: {
          backgroundColor: 'transparent',
          transition: 'all 0.5s ease !important',
        },
      },
    },
    MuiSpeedDialAction: {
      styleOverrides: {
        fab: {
          backgroundColor: 'transparent',
          transition: 'all 0.5s ease',
          margin: '0px',
          marginBottom: '16px',
          '&:hover': {
            backgroundColor: primary,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: 'Roboto Mono, monospace',
          backgroundColor: primary,
          fontSize: 12,
        },
      },
    },
  },
};

// Light theme
export const LightTheme = responsiveFontSizes(
  createTheme({
    ...baseTheme,
    palette: {
      mode: 'light',
      primary: { main: primary },
      secondary: { main: secondary },
      background: { default: white },
      text: { primary: black },
    },
    components: {
      ...baseTheme.components,
      MuiFab: {
        ...baseTheme.components.MuiFab,
        styleOverrides: {
          ...baseTheme.components.MuiFab.styleOverrides,
          primary: {
            ...baseTheme.components.MuiFab.styleOverrides.primary,
            color: black,
            '&:hover': { color: black },
          },
        },
      },
      MuiTooltip: {
        ...baseTheme.components.MuiTooltip,
        styleOverrides: {
          ...baseTheme.components.MuiTooltip.styleOverrides,
          tooltip: {
            ...baseTheme.components.MuiTooltip.styleOverrides.tooltip,
            color: black,
          },
        },
      },
    },
  })
);

// Dark theme
export const DarkTheme = responsiveFontSizes(
  createTheme({
    ...baseTheme,
    palette: {
      mode: 'dark',
      primary: { main: primary },
      secondary: { main: secondary },
      background: { default: black },
      text: { primary: white },
    },
    components: {
      ...baseTheme.components,
      MuiFab: {
        ...baseTheme.components.MuiFab,
        styleOverrides: {
          ...baseTheme.components.MuiFab.styleOverrides,
          primary: {
            ...baseTheme.components.MuiFab.styleOverrides.primary,
            color: white,
            '&:hover': { color: white },
          },
        },
      },
      MuiTooltip: {
        ...baseTheme.components.MuiTooltip,
        styleOverrides: {
          ...baseTheme.components.MuiTooltip.styleOverrides,
          tooltip: {
            ...baseTheme.components.MuiTooltip.styleOverrides.tooltip,
            color: white,
          },
        },
      },
    },
  })
);
