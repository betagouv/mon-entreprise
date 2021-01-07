import { EvaluationFunction } from '..'
import { ASTNode } from '../AST/types'
import { warning } from '../error'
import { defaultNode, evaluateObject, parseObject } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { convertNodeToUnit, simplifyNodeUnit } from '../nodeUnits'
import { areUnitConvertible, convertUnit, inferUnit } from '../units'

export type ProductNode = {
	explanation: {
		assiette: ASTNode
		facteur: ASTNode
		plafond: ASTNode
		taux: ASTNode
	}
	nodeKind: 'produit'
}

const objectShape = {
	assiette: false,
	taux: defaultNode(1),
	facteur: defaultNode(1),
	plafond: defaultNode(Infinity),
}

export const mecanismProduct = (v, context) => {
	const explanation = parseObject(objectShape, v, context)

	return {
		explanation,
		nodeKind: 'produit',
	} as ProductNode
}

const productEffect: EvaluationFunction = function ({
	assiette,
	taux,
	facteur,
	plafond,
}: any) {
	if (assiette.unit) {
		try {
			plafond = convertNodeToUnit(assiette.unit, plafond)
		} catch (e) {
			warning(
				this.options.logger,
				this.cache._meta.ruleStack[0],
				"Impossible de convertir l'unité du plafond du produit dans celle de l'assiette",
				e
			)
		}
	}
	const mult = (base, rate, facteur, plafond) =>
		Math.min(base, plafond === false ? Infinity : plafond) * rate * facteur
	let nodeValue = [taux, assiette, facteur].some((n) => n.nodeValue === false)
		? false
		: [taux, assiette, facteur].some((n) => n.nodeValue === 0)
		? 0
		: [taux, assiette, facteur].some((n) => n.nodeValue === null)
		? null
		: mult(
				assiette.nodeValue,
				taux.nodeValue,
				facteur.nodeValue,
				plafond.nodeValue
		  )
	let unit = inferUnit(
		'*',
		[assiette, taux, facteur].map((el) => el.unit)
	)
	if (areUnitConvertible(unit, assiette.unit)) {
		nodeValue = convertUnit(unit, assiette.unit, nodeValue)
		unit = assiette.unit
	}
	return simplifyNodeUnit({
		nodeValue,
		unit,

		explanation: {
			plafondActif: assiette.nodeValue > plafond.nodeValue,
		},
	})
}

const evaluate = evaluateObject<'produit'>(productEffect)

registerEvaluationFunction('produit', evaluate)
