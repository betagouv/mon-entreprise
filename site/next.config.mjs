/** @type {import('next').NextConfig} */
const nextConfig = {
	compiler: {
		styledComponents: true,
	},

	env: {
		LANGUE: process.env.LANGUE ?? 'fr',
	},

	transpilePackages: [
		'modele-social',
		'modele-as',
		'modele-ti',
		'exoneration-covid',
		'publicodes',
		'@publicodes/react-ui',
	],
}

export default nextConfig
