import { evolve } from 'ramda'
import { ASTNode, Evaluation } from '../AST/types'
import { evaluationError, typeWarning } from '../error'
import { mergeAllMissing } from '../evaluation'
import parse from '../parse'
import { convertUnit, inferUnit } from '../units'

type TrancheNode = { taux: ASTNode } | { montant: ASTNode }
export type TrancheNodes = Array<TrancheNode & { plafond?: ASTNode }>

export const parseTranches = (tranches, context): TrancheNodes => {
	return tranches
		.map((t, i) => {
			if (!t.plafond && i > tranches.length) {
				throw new SyntaxError(
					`La tranche n°${i} du barème n'a pas de plafond précisé. Seule la dernière tranche peut ne pas être plafonnée`
				)
			}
			return { ...t, plafond: t.plafond ?? Infinity }
		})
		.map(
			evolve({
				taux: (node) => parse(node, context),
				montant: (node) => parse(node, context),
				plafond: (node) => parse(node, context),
			})
		)
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
					activeTrancheFound,
				]
			}

			const plafond = evaluate(parsedTranche.plafond)
			if (plafond.temporalValue) {
				evaluationError(
					cache._meta.contextRule,
					'Les valeurs temporelles ne sont pas acceptées pour un plafond de tranche'
				)
			}
			const plancher = tranches[i - 1]
				? tranches[i - 1].plafond
				: { nodeValue: 0 }

			let plafondValue: Evaluation<number> =
				plafond.nodeValue === null || multiplicateur.nodeValue === null
					? null
					: plafond.nodeValue * multiplicateur.nodeValue

			try {
				plafondValue =
					plafondValue === Infinity || plafondValue === 0
						? plafondValue
						: convertUnit(
								inferUnit('*', [plafond.unit, multiplicateur.unit]),
								assiette.unit,
								plafondValue
						  )
			} catch (e) {
				typeWarning(
					cache._meta.contextRule,
					`L'unité du plafond de la tranche n°${
						i + 1
					}  n'est pas compatible avec celle l'assiette`,
					e
				)
			}
			const plancherValue = tranches[i - 1] ? tranches[i - 1].plafondValue : 0
			const isAfterActive =
				plancherValue === null || assiette.nodeValue === null
					? null
					: plancherValue > assiette.nodeValue

			const calculationValues = [plafond, assiette, multiplicateur, plancher]
			if (calculationValues.some((node) => node.nodeValue === null)) {
				return [
					[
						...tranches,
						{
							...parsedTranche,
							plafond,
							plafondValue,
							plancherValue,
							nodeValue: null,
							isActive: null,
							isAfterActive,
							missingVariables: mergeAllMissing(calculationValues),
						},
					],
					false,
				]
			}

			if (
				!!tranches[i - 1] &&
				!!plancherValue &&
				(plafondValue as number) <= plancherValue
			) {
				evaluationError(
					cache._meta.contextRule,
					`Le plafond de la tranche n°${
						i + 1
					} a une valeur inférieure à celui de la tranche précédente`
				)
			}

			const tranche = {
				...parsedTranche,
				plafond,
				plancherValue,
				plafondValue,
				isAfterActive,
				isActive:
					assiette.nodeValue >= plancherValue &&
					assiette.nodeValue < (plafondValue as number),
			}

			return [[...tranches, tranche], tranche.isActive]
		},
		[[], false]
	)[0]
}
