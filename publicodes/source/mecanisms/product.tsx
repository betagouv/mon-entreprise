import { evaluationFunction } from '..'
import Product from '../components/mecanisms/Product'
import { typeWarning } from '../error'
import {
	defaultNode,
	evaluateObject,
	parseObject,
	registerEvaluationFunction
} from '../evaluation'
import { convertNodeToUnit, simplifyNodeUnit } from '../nodeUnits'
import { areUnitConvertible, convertUnit, inferUnit } from '../units'

const objectShape = {
	assiette: false,
	taux: defaultNode(1),
	facteur: defaultNode(1),
	plafond: defaultNode(Infinity)
}

export const mecanismProduct = (recurse, v) => {
	const explanation = parseObject(recurse, objectShape, v)

	return {
		jsx: Product,
		explanation,
		category: 'mecanism',
		name: 'produit',
		nodeKind: 'produit',
		type: 'numeric',
		unit: inferUnit(
			'*',
			[explanation.assiette, explanation.taux, explanation.facteur].map(
				el => el.unit
			)
		)
	}
}

const productEffect: evaluationFunction = function({
	assiette,
	taux,
	facteur,
	plafond
}: any) {
	if (assiette.unit) {
		try {
			plafond = convertNodeToUnit(assiette.unit, plafond)
		} catch (e) {
			typeWarning(
				this.cache._meta.contextRule,
				"Impossible de convertir l'unité du plafond du produit dans celle de l'assiette",
				e
			)
		}
	}
	const mult = (base, rate, facteur, plafond) =>
		Math.min(base, plafond === false ? Infinity : plafond) * rate * facteur
	let nodeValue = [taux, assiette, facteur].some(n => n.nodeValue === false)
		? false
		: [taux, assiette, facteur].some(n => n.nodeValue === 0)
		? 0
		: [taux, assiette, facteur].some(n => n.nodeValue === null)
		? null
		: mult(
				assiette.nodeValue,
				taux.nodeValue,
				facteur.nodeValue,
				plafond.nodeValue
		  )
	let unit = inferUnit(
		'*',
		[assiette, taux, facteur].map(el => el.unit)
	)
	if (areUnitConvertible(unit, assiette.unit)) {
		nodeValue = convertUnit(unit, assiette.unit, nodeValue)
		unit = assiette.unit
	}
	return simplifyNodeUnit({
		nodeValue,
		unit,
		explanation: {
			plafondActif: assiette.nodeValue > plafond.nodeValue
		}
	})
}

const evaluate = evaluateObject(productEffect)

registerEvaluationFunction('produit', evaluate)
