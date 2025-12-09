/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
			},
			backgroundColor: {
				'light-blue': '#eff1ff',
				'primary-gray': '#ECECEC',
			},
			colors: {
				blue: '#5C78FF',
			},
			borderColor: {
				'primary-gray': '#ECECEC',
			},
		},
	},
	plugins: [],
};
