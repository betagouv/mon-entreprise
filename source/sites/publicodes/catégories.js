const authorizedNamespaces = [
	'transport',
	'logement',
	'nourriture',
	'numérique',
	'vêtements',
]
const catégorie = ({ catégorie, dottedName }) => {
	if (catégorie) return catégorie

	const found = authorizedNamespaces.find((a) => dottedName.includes(a + ' . '))
	return found || 'DIVERS'
}

export default (rules) => {
	const catégories = Object.entries(
		rules.reduce((memo, next) => {
			const category = catégorie(next)
			memo[category] = [...(memo[category] || []), next]
			return memo
		}, {})
	)
}
