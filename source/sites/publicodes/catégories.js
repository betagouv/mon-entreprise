const catégories = [
	'transport',
	'logement',
	'numérique',
	'vêtements',
	'divers',
	'nourriture',
]
const catégorie = ({ catégorie, dottedName }) => {
	if (catégorie && catégories.includes(catégorie)) return catégorie

	const found = catégories.find((a) => dottedName.includes(a + ' . '))
	return found || 'divers'
}

export default (rules) => {
	const raw = Object.entries(
		rules.reduce((memo, next) => {
			const category = catégorie(next)
			memo[category] = [...(memo[category] || []), next]
			return memo
		}, {})
	)
	return raw.sort(([c1], [c2]) =>
		console.log(c1, c2, catégories.indexOf(c2), catégories.indexOf(c1)) ||
		c1 === 'nourriture'
			? 1
			: catégories.indexOf(c1) - catégories.indexOf(c2)
	)
}
