const colors = {
	ruleProp: '#9b59b6',
	'applicable si': '#9b59b6',
	'non applicable si': '#9b59b6',
	produit: '#2ecc71',
	'une de ces conditions': '#3498db',
	'toutes ces conditions': '#3498db',
	composantes: '#3498db',
	variations: '#FF9800',
	'taux progressif': '#795548',
	barème: '#607D8B',
	grille: '#AD1457'
}

export default (name: string) => colors[name] || '#34495e'
