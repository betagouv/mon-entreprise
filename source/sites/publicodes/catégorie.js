const authorizedNamespaces = [
	'transport',
	'logement',
	'nourriture',
	'numérique'
]
export default ({ catégorie, dottedName }) => {
	if (catégorie) return catégorie

	const found = authorizedNamespaces.find(a => dottedName.includes(a + ' . '))
	return found || 'DIVERS'
}
