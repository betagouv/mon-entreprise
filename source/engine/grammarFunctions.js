import React from 'react'

export let boolean = nodeValue => ({
	category: 'boolean',
	nodeValue: nodeValue,
	// eslint-disable-next-line
	jsx: () => <span className="boolean">{rawNode}</span>
})

export let percentage = d => ({
	// We don't need to handle category == 'value' because YAML then returns it as
	// numerical value, not a String: it goes to treatNumber
	nodeValue:
		parseFloat(d[0].join('') + (d[1] ? d[1][0] + d[1][1].join('') : '')) / 100,
	category: 'percentage',
	// eslint-disable-next-line
	jsx: () => <span className="value">{rawNode.split('%')[0]} %</span>
	//on ajoute l'espace nécessaire en français avant le pourcentage
})
