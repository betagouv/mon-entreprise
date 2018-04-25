import React from 'react'
import { parseObject, evaluateObject } from 'Engine/evaluation'
import { val } from 'Engine/traverse-common-functions'
import communesZRR from 'Règles/communes-zrr.json'

let jsx = (nodeValue, explanation) => (
	<div>Explication manquante du mécanisme d'inclusion</div>
)

export default (recurse, k, v) => {
	let objectShape = {
		de: false
	}

	let effect = ({ de }) => {
		if (val(de) == null) return null
		let found = communesZRR.find(codeCommune => codeCommune === '' + val(de))
		//TODO hack : this mecanism is used in a formula, formulas require this type of output for booleans (applicability conditions return true / false)
		return found ? 'oui' : 'non'
	}

	let explanation = {
			...parseObject(recurse, objectShape, v)
		},
		evaluate = evaluateObject(objectShape, effect)

	return {
		evaluate,
		explanation,
		category: 'mecanism',
		name: 'réduction linéaire',
		type: 'boolean',
		jsx
	}
}
