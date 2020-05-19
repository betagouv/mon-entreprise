const colors = {
	'applicable si': '#9b59b6',
	'non applicable si': '#9b59b6',
	somme: '#18457B',
	allègement: '#B73731',
	produit: '#2ecc71',
	'une de ces conditions': '#3498db',
	'toutes ces conditions': '#3498db',
	composantes: '#3498db',
	variations: '#FF9800',
	'taux progressif': '#795548',
	barème: '#9B296F',
	grille: '#AD1457'
}
export default name => colors[name] || 'palevioletred'
