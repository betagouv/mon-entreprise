import { defaultNode, evaluateNode, mergeAllMissing } from 'Engine/evaluation'
import { decompose } from 'Engine/mecanisms/utils'
import variations from 'Engine/mecanisms/variations'
import tauxProgressif from 'Engine/mecanismViews/TauxProgressif'
import { anyNull } from 'Engine/traverse-common-functions'
import { convertUnit, parseUnit } from 'Engine/units'
import {
	evaluatePlafondUntilActiveTranche,
	parseTranches
} from './trancheUtils'

export default function parse(parse, k, v) {
	if (v.composantes) {
		//mécanisme de composantes. Voir known-mecanisms.md/composantes
		return decompose(parse, k, v)
	}
	if (v.variations) {
		return variations(parse, k, v, true)
	}

	let explanation = {
		assiette: parse(v.assiette),
		multiplicateur: v.multiplicateur ? parse(v.multiplicateur) : defaultNode(1),
		tranches: parseTranches(parse, v.tranches)
	}
	return {
		evaluate,
		jsx: tauxProgressif,
		explanation,
		category: 'mecanism',
		name: 'taux progressif',
		type: 'numeric',
		unit: parseUnit('%')
	}
}

const evaluate = (
	cache,
	situationGate,
	parsedRules,
	node: ReturnType<typeof parse>
) => {
	const evaluate = evaluateNode.bind(null, cache, situationGate, parsedRules)
	const assiette = evaluate(node.explanation.assiette)
	const multiplicateur = evaluate(node.explanation.multiplicateur)
	const tranches = evaluatePlafondUntilActiveTranche(
		evaluate,
		{
			parsedTranches: node.explanation.tranches,
			assiette,
			multiplicateur
		},
		cache
	)
	const activeTrancheIndex = tranches.findIndex(
		({ isActive }) => isActive === true
	)

	let nodeValue = null
	let missingVariables = mergeAllMissing(tranches)
	if (activeTrancheIndex !== -1) {
		const activeTranche = tranches[activeTrancheIndex]
		const previousTranche = tranches[activeTrancheIndex - 1] ?? {
			...activeTranche,
			plafond: { nodeValue: 0 }
		}
		previousTranche.taux = evaluate(previousTranche.taux)
		activeTranche.taux = evaluate(activeTranche.taux)

		const calculationValues = [
			previousTranche.taux,
			activeTranche.taux,
			activeTranche
		]
		if (anyNull(calculationValues)) {
			activeTranche.nodeValue = null
			activeTranche.missingVariables = mergeAllMissing(calculationValues)
		} else {
			const lowerTaux = previousTranche.taux.nodeValue
			const upperTaux = activeTranche.taux.nodeValue
			const plancher = activeTranche.plancherValue
			const plafond = activeTranche.plafondValue
			const coeff = (upperTaux - lowerTaux) / (plafond - plancher)
			const nodeValue =
				coeff === Infinity || plafond === Infinity
					? upperTaux
					: lowerTaux + (assiette.nodeValue - plancher) * coeff

			activeTranche.nodeValue = convertUnit(
				parseUnit(''),
				parseUnit('%'),
				nodeValue
			)
			activeTranche.unit = parseUnit('%')
		}
		nodeValue = activeTranche.nodeValue
		missingVariables = activeTranche.missingVariables
	}

	return {
		tranches,
		assiette,
		multiplicateur,
		nodeValue,
		missingVariables
	}
}
