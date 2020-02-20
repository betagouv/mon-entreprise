import { mergeAllMissing } from 'Engine/evaluation'
import { evolve } from 'ramda'
import { evaluationError, typeWarning } from '../error'
import { convertUnit, inferUnit } from '../units'

export const parseTranches = (parse, tranches) => {
	if (tranches.slice(-1)[0].plafond != null) {
		tranches = [...tranches, { montant: 0, taux: 0 }]
	}
	return tranches
		.map((t, i) => {
			if (!t.plafond && i > tranches.length) {
				console.log(t, i)
				throw new SyntaxError(
					`La tranche n°${i} du barème n'a pas de plafond précisé. Seule la dernière tranche peut ne pas être plafonnée`
				)
			}
			return { ...t, plafond: t.plafond ?? Infinity }
		})
		.map(evolve({ taux: parse, montant: parse, plafond: parse }))
}

export function evaluatePlafondUntilActiveTranche(
	evaluate,
	{ multiplicateur, assiette, parsedTranches },
	cache
) {
	return parsedTranches.reduce(
		([tranches, activeTrancheFound], parsedTranche, i: number) => {
			if (activeTrancheFound) {
				return [
					[...tranches, { ...parsedTranche, isAfterActive: true }],
					activeTrancheFound
				]
			}

			const plafond = evaluate(parsedTranche.plafond)
			const plancher = tranches[i - 1]
				? tranches[i - 1].plafond
				: { nodeValue: 0 }
			const calculationValues = [plafond, assiette, multiplicateur, plancher]
			if (calculationValues.some(node => node.nodeValue === null)) {
				return [
					[
						...tranches,
						{
							...parsedTranche,
							plafond,
							nodeValue: null,
							isActive: null,
							isAfterActive: false,
							missingVariables: mergeAllMissing(calculationValues)
						}
					],
					false
				]
			}
			let plafondValue = plafond.nodeValue * multiplicateur.nodeValue
			try {
				plafondValue = [Infinity || 0].includes(plafondValue)
					? plafondValue
					: convertUnit(
							inferUnit('*', [plafond.unit, multiplicateur.unit]),
							assiette.unit,
							plafondValue
					  )
			} catch (e) {
				typeWarning(
					cache._meta.contextRule,
					`L'unité du plafond de la tranche n°${i +
						1}  n'est pas compatible avec celle l'assiette`,
					e
				)
			}

			let plancherValue = tranches[i - 1] ? tranches[i - 1].plafondValue : 0
			if (!!tranches[i - 1] && plafondValue <= plancherValue) {
				evaluationError(
					cache._meta.contextRule,
					`Le plafond de la tranche n°${i +
						1} a une valeur inférieure à celui de la tranche précédente`
				)
			}

			const tranche = {
				...parsedTranche,
				plafond,
				plancherValue,
				plafondValue,
				isAfterActive: false,
				isActive:
					assiette.nodeValue >= plancherValue &&
					assiette.nodeValue < plafondValue
			}

			return [[...tranches, tranche], tranche.isActive]
		},
		[[], false]
	)[0]
}
