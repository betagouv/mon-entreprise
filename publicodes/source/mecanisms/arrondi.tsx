import React from 'react'
import { evaluationFunction } from '..'
import { InfixMecanism } from '../components/mecanisms/common'
import { makeJsx, mergeAllMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'
import { ASTNode } from '../AST/types'

export type ArrondiNode = {
	explanation: {
		arrondi: ASTNode
		valeur: ASTNode
	}
	jsx: any
	nodeKind: 'arrondi'
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

const evaluate: evaluationFunction<'arrondi'> = function (node) {
	const valeur = this.evaluateNode(node.explanation.valeur)
	const nodeValue = valeur.nodeValue
	let arrondi = node.explanation.arrondi
	if (nodeValue !== false) {
		arrondi = this.evaluateNode(arrondi)
	}

	return {
		...node,
		nodeValue:
			typeof valeur.nodeValue !== 'number' || !('nodeValue' in arrondi)
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
		unit: valeur.unit,
	}
}

export default function Arrondi(v, context) {
	const explanation = {
		valeur: parse(v.valeur, context),
		arrondi: parse(v.arrondi, context),
	}
	return {
		jsx: MecanismArrondi,
		explanation,
		nodeKind: Arrondi.nom,
	}
}

Arrondi.nom = 'arrondi' as const

registerEvaluationFunction(Arrondi.nom, evaluate)
