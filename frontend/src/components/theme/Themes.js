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
					boxShadow: 'none',
					'&:hover': {
						backgroundColor: 'rgba(66, 188, 188, 0.1)',
					},
					transition: 'all 0.3s ease',
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
	})
);