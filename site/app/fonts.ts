import localFont from 'next/font/local'

export const roboto = localFont({
	src: [
		{
			path: '../source/public/fonts/roboto-v29-latin-regular.woff2',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../source/public/fonts/roboto-v29-latin-italic.woff2',
			weight: '400',
			style: 'italic',
		},
		{
			path: '../source/public/fonts/roboto-v29-latin-500.woff2',
			weight: '500',
			style: 'normal',
		},
		{
			path: '../source/public/fonts/roboto-v29-latin-500italic.woff2',
			weight: '500',
			style: 'italic',
		},
		{
			path: '../source/public/fonts/roboto-v29-latin-700.woff2',
			weight: '700',
			style: 'normal',
		},
		{
			path: '../source/public/fonts/roboto-v29-latin-700italic.woff2',
			weight: '700',
			style: 'italic',
		},
	],
	display: 'swap',
	variable: '--font-roboto',
})

export const montserrat = localFont({
	src: '../source/public/fonts/montserrat-v18-latin-700.woff2',
	weight: '700',
	style: 'normal',
	display: 'swap',
	variable: '--font-montserrat',
})
