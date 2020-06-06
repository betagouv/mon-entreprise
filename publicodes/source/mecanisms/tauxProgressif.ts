import { defaultNode, evaluateNode, mergeAllMissing } from '../evaluation'
import tauxProgressif from '../components/mecanisms/TauxProgressif'
import { convertNodeToUnit } from '../nodeUnits'
import { parseUnit } from '../units'
import {
	evaluatePlafondUntilActiveTranche,
	parseTranches
} from './trancheUtils'

export default function parse(parse, k, v) {
	const explanation = {
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
	situation,
	parsedRules,
	node: ReturnType<typeof parse>
) => {
	const evaluate = evaluateNode.bind(null, cache, situation, parsedRules)
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

	const evaluatedNode = {
		...node,
		explanation: {
			tranches,
			assiette,
			multiplicateur
		},
		unit: parseUnit('%')
	}

	const lastTranche = tranches[tranches.length - 1]
	if (
		tranches.every(({ isActive }) => isActive === false) ||
		(lastTranche.isActive && lastTranche.plafond.nodeValue === Infinity)
	) {
		const taux = convertNodeToUnit(parseUnit('%'), evaluate(lastTranche.taux))
		const { nodeValue, missingVariables } = taux
		lastTranche.taux = taux
		lastTranche.nodeValue = nodeValue
		lastTranche.missingVariables = missingVariables
		return {
			...evaluatedNode,
			nodeValue,
			missingVariables
		}
	}

	if (tranches.every(({ isActive }) => isActive !== true)) {
		return {
			...evaluatedNode,
			nodeValue: null,
			missingVariables: mergeAllMissing(tranches)
		}
	}

	const activeTrancheIndex = tranches.findIndex(
		({ isActive }) => isActive === true
	)
	const activeTranche = tranches[activeTrancheIndex]
	activeTranche.taux = convertNodeToUnit(
		parseUnit('%'),
		evaluate(activeTranche.taux)
	)

	const previousTranche = tranches[activeTrancheIndex - 1]
	if (previousTranche) {
		previousTranche.taux = convertNodeToUnit(
			parseUnit('%'),
			evaluate(previousTranche.taux)
		)
		previousTranche.isActive = true
	}
	const previousTaux = previousTranche
		? previousTranche.taux
		: activeTranche.taux
	const calculationValues = [previousTaux, activeTranche.taux, activeTranche]
	if (calculationValues.some(n => n.nodeValue === null)) {
		activeTranche.nodeValue = null
		activeTranche.missingVariables = mergeAllMissing(calculationValues)
		return {
			...evaluatedNode,
			nodeValue: null,
			activeTranche: activeTranche.missingVariables
		}
	}

	const lowerTaux = previousTaux.nodeValue
	const upperTaux = activeTranche.taux.nodeValue
	const plancher = activeTranche.plancherValue
	const plafond = activeTranche.plafondValue
	const coeff = (upperTaux - lowerTaux) / (plafond - plancher)
	const nodeValue = lowerTaux + (assiette.nodeValue - plancher) * coeff
	activeTranche.nodeValue = nodeValue
	return {
		...evaluatedNode,
		nodeValue
	}
}
