import { isPublicodesError, PublicodesExpression } from 'publicodes'

import { setEngineSituation } from '@/domaine/engine/engineCache'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/SimulationConfig'
import { omit } from '@/utils'

/**
 * Try to set situation and delete all rules with syntax/evaluation error
 */
export const safeSetSituation = <Names extends DottedName>(
	nomModèle: NomModèle,
	rawSituation: Partial<Record<Names, PublicodesExpression>>,
	onError: (data: {
		situation: Partial<Record<Names, PublicodesExpression>>
		faultyDottedName?: Names
	}) => void
) => {
	let situationError = false
	const errors: Error[] = []
	let situation = { ...rawSituation }
	do {
		try {
			// Try to set situation
			setEngineSituation(nomModèle, situation)
			situationError = false
		} catch (error) {
			situationError = true

			// Clears the situation to avoid an infinite loop
			// if the error is already known
			if (
				errors.some(
					(err) =>
						err.name === (error as Error).name &&
						err.message === (error as Error).message
				)
			) {
				throw error
			}
			errors.push(error as Error)

			// If it's a Publicodes syntax/evaluation error
			if (
				(isPublicodesError(error, 'SyntaxError') ||
					isPublicodesError(error, 'EvaluationError')) &&
				error.info.dottedName
			) {
				const faultyDottedName = error.info.dottedName as Names

				// eslint-disable-next-line no-console
				console.error(
					`Key omit from situation: "${faultyDottedName}"\n\n`,
					error
				)

				// Omit faultyDottedName from situation for next loop
				situation = omit(situation, faultyDottedName) as typeof rawSituation

				onError({ faultyDottedName, situation })
			} else {
				// eslint-disable-next-line no-console
				console.error('safeSituationCatch', error)
			}
		}
	} while (situationError && errors.length < 1000)
}
