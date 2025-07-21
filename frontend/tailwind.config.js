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
				'box-bounce-1': {
					'0%, 70%, 100%': {
						transform: 'translateY(0) rotate(0deg)',
						boxShadow: '0 15px 35px rgba(32, 201, 226, 0.1)'
					},
					'30%': {
						transform: 'translateY(-30px) rotate(45deg)',
						boxShadow: '0 25px 45px rgba(32, 201, 226, 0.3)'
					},
				},
				'box-bounce-2': {
					'0%, 30%, 100%': {
						transform: 'translateY(0) rotate(0deg)',
						boxShadow: '0 15px 35px rgba(32, 201, 226, 0.1)'
					},
					'60%': {
						transform: 'translateY(-30px) rotate(45deg)',
						boxShadow: '0 25px 45px rgba(32, 201, 226, 0.3)'
					},
				},
				'box-bounce-3': {
					'0%, 60%, 100%': {
						transform: 'translateY(0) rotate(0deg)',
						boxShadow: '0 15px 35px rgba(32, 201, 226, 0.1)'
					},
					'90%': {
						transform: 'translateY(-30px) rotate(45deg)',
						boxShadow: '0 25px 45px rgba(32, 201, 226, 0.3)'
					},
				},
			},
			backdropBlur: {
				xs: '2px',
			},
			screens: {
				'xs': '320px',
			},
			columns: {
				'1': '1',
				'2': '2',
				'3': '3',
				'4': '4',
			},
			maxWidth: {
				'screen-safe': '95vw',
			},
		},
	},
	plugins: [],
}