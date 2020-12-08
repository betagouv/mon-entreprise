import { EvaluationFunction } from '..'
import { mergeAllMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'
import { ASTNode } from '../AST/types'

export type ArrondiNode = {
	explanation: {
		arrondi: ASTNode
		valeur: ASTNode
	}
	nodeKind: 'arrondi'
}

function roundWithPrecision(n: number, fractionDigits: number) {
	return +n.toFixed(fractionDigits)
}

const evaluate: EvaluationFunction<'arrondi'> = function (node) {
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

export default function parseArrondi(v, context) {
	const explanation = {
		valeur: parse(v.valeur, context),
		arrondi: parse(v.arrondi, context),
	}
	return {
		explanation,
		nodeKind: parseArrondi.nom,
	}
}

parseArrondi.nom = 'arrondi' as const

registerEvaluationFunction(parseArrondi.nom, evaluate)
