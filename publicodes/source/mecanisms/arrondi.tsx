import React from 'react'
import { evaluationFunction } from '..'
import { InfixMecanism } from '../components/mecanisms/common'
import {
	makeJsx,
	mergeAllMissing,
	registerEvaluationFunction
} from '../evaluation'
import { EvaluatedNode } from '../types'

export type ArrondiExplanation = {
	valeur: EvaluatedNode<string, number>
	arrondi: EvaluatedNode<string, number>
}

function MecanismArrondi({ explanation }) {
	return (
		<InfixMecanism value={explanation.valeur}>
			<p>
				<strong>Arrondi : </strong>
				{makeJsx(explanation.arrondi)}
			</p>
		</InfixMecanism>
	)
}

function roundWithPrecision(n: number, fractionDigits: number) {
	return +n.toFixed(fractionDigits)
}

const evaluate: evaluationFunction = function(node) {
	const valeur = this.evaluateNode(node.explanation.valeur)
	const nodeValue = valeur.nodeValue
	let arrondi = node.explanation.arrondi
	if (nodeValue !== false) {
		arrondi = this.evaluateNode(arrondi)
	}

	return {
		...node,
		nodeValue:
			typeof valeur.nodeValue !== 'number'
				? valeur.nodeValue
				: typeof arrondi.nodeValue === 'number'
				? roundWithPrecision(valeur.nodeValue, arrondi.nodeValue)
				: arrondi.nodeValue === true
				? roundWithPrecision(valeur.nodeValue, 0)
				: arrondi.nodeValue === null
				? null
				: valeur.nodeValue,
		explanation: { valeur, arrondi },
		missingVariables: mergeAllMissing([valeur, arrondi]),
		unit: valeur.unit
	}
}

export default function Arrondi(recurse, v) {
	const explanation = {
		valeur: recurse(v.valeur),
		arrondi: recurse(v.arrondi)
	}
	return {
		jsx: MecanismArrondi,
		explanation,
		category: 'mecanism',
		name: 'arrondi',
		nodeKind: Arrondi.nom,
		type: 'numeric',
		unit: explanation.valeur.unit
	}
}

Arrondi.nom = 'arrondi'

registerEvaluationFunction(Arrondi.nom, evaluate)
