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
				loader: "#20c9e2",
				loaderBg: "#151c29",
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
				'box-bounce-1': 'box-bounce-1 1.5s infinite',
				'box-bounce-2': 'box-bounce-2 1.5s infinite',
				'box-bounce-3': 'box-bounce-3 1.5s infinite',
				'slide-up': 'slideUp 0.6s ease-out forwards',
				'slide-in': 'slideIn 0.6s ease-out forwards',
			},
			screens: {
				'xs': '375px',
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1536px',
			},
			spacing: {
				'18': '4.5rem',
				'22': '5.5rem',
			}
		},
	},
	plugins: [],
}