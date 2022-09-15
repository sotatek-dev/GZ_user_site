/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		screens: {
			mobile: '320px',
			// => @media (min-width: 320px) { ... }

			tablet: '640px',
			// => @media (min-width: 640px) { ... }

			laptop: '1024px',
			// => @media (min-width: 1024px) { ... }

			desktop: '1280px',
			// => @media (min-width: 1280px) { ... }
		},

		extend: {},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			'background-dark': '#0C1E32',
			white: '#FFFFFF',
			ebony: '#2C313D',
			'ebony-20': '#272E39',
			'blue-zodiac': '#424959',
			'black-russian': '#121327',
			violet: '#9e90f380',
			'chetwode-blue': '#9793F3',
			purple: '#262645',
			'purple-10': '#2f3041',
			blue: '#1890FF',
			'black-velvet': '#232436',
			'dim-gray': '#71717d',
			'butterfly-bush': '#59518C',
		},
	},
	plugins: [],
};
