/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"./public/index.html",
	],
	theme: {
		extend: {
			colors: {
				primary: "#42bcbc",
				secondary: "#ec704c",
				dark: {
					DEFAULT: "#0f172a",
					lighter: "#1e293b",
					card: "rgba(30, 41, 59, 0.5)"
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace']
			},
			animation: {
				'gradient': 'gradient 15s ease infinite',
				'float': 'float 6s ease-in-out infinite',
				'pulse-slow': 'pulse 3s ease-in-out infinite',
				'text-reveal': 'text-reveal 1.5s ease-out forwards',
			},
			keyframes: {
				gradient: {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				pulse: {
					'0%, 100%': { transform: 'scale(1)', opacity: '1' },
					'50%': { transform: 'scale(1.1)', opacity: '0.8' },
				},
				'text-reveal': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
			},
			backdropBlur: {
				xs: '2px',
			}
		},
	},
	plugins: [],
}