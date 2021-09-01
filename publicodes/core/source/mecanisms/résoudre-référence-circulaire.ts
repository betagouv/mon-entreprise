import { EvaluationFunction } from '..'
import { ASTNode, ConstantNode, Unit } from '../AST/types'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'
import { Context } from '../parsePublicodes'
import uniroot from '../uniroot'
import { UnitéNode } from './unité'

export type RésoudreRéférenceCirculaireNode = {
	explanation: {
		ruleToSolve: string
		valeur: ASTNode
	}
	nodeKind: 'résoudre référence circulaire'
}

export const evaluateRésoudreRéférenceCirculaire: EvaluationFunction<'résoudre référence circulaire'> =
	function (node) {
		const originalCache = this.cache
		let inversionNumberOfIterations = 0

		const evaluateWithValue = (
			n: number,
			unit: Unit = { numerators: [], denominators: [] }
		) => {
			inversionNumberOfIterations++
			this.resetCache()

			this.parsedSituation[node.explanation.ruleToSolve] = {
				unit: unit,
				nodeKind: 'unité',
				explanation: {
					nodeKind: 'constant',
					nodeValue: n,
					type: 'number',
				} as ConstantNode,
			} as UnitéNode
			return this.evaluate(node.explanation.valeur)
		}

		let nodeValue: number | null | undefined = null

		const x0 = 0
		let valeur = evaluateWithValue(x0)

		const y0 = valeur.nodeValue as number
		const unit = valeur.unit
		const missingVariables = valeur.missingVariables
		let i = 0
		if (y0 !== null) {
			// The `uniroot` function parameter. It will be called with its `min` and
			// `max` arguments, so we can use our cached nodes if the function is called
			// with the already computed x1 or x2.
			const test = (x: number): number => {
				if (x === x0) {
					return y0 - x0
				}
				valeur = evaluateWithValue(x, unit)
				const y = valeur.nodeValue
				i++
				return (y as number) - x
			}

			const defaultMin = -1_000_000
			const defaultMax = 100_000_000

			nodeValue = uniroot(test, defaultMin, defaultMax, 0.5, 30, 2)
		}

		this.cache = originalCache

		if (nodeValue === undefined) {
			nodeValue = null
			this.cache._meta.inversionFail = true
		}
		if (nodeValue !== null) {
			valeur = evaluateWithValue(nodeValue, unit)
		}
		delete this.parsedSituation[node.explanation.ruleToSolve]

		return {
			...node,
			unit,
			nodeValue,
			explanation: {
				...node.explanation,
				valeur,
				inversionNumberOfIterations,
			},
			missingVariables,
		}
	}

export default function parseRésoudreRéférenceCirculaire(v, context: Context) {
	return {
		explanation: {
			ruleToSolve: context.dottedName,
			valeur: parse(v.valeur, context),
		},
		nodeKind: 'résoudre référence circulaire',
	} as RésoudreRéférenceCirculaireNode
}

parseRésoudreRéférenceCirculaire.nom = 'résoudre la référence circulaire'

registerEvaluationFunction(
	'résoudre référence circulaire',
	evaluateRésoudreRéférenceCirculaire
)
