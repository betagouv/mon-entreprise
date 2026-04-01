import { isPublicodesError, PublicodesExpression } from 'publicodes'

import { omit } from '@/utils'

export const safeSetSituation = <Names extends string>(
	setSituation: (
		situation: Partial<Record<Names, PublicodesExpression>>
	) => void,
	rawSituation: Partial<Record<Names, PublicodesExpression>>,
	onError?: (data: {
		situation: Partial<Record<Names, PublicodesExpression>>
		faultyDottedName?: Names
	}) => void
) => {
	let situationError = false
	const errors: Error[] = []
	let situation = { ...rawSituation }
	do {
		try {
			setSituation(situation)
			situationError = false
		} catch (error) {
			situationError = true

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

			if (
				(isPublicodesError(error, 'SyntaxError') ||
					isPublicodesError(error, 'EvaluationError') ||
					isPublicodesError(error, 'SituationError')) &&
				error.info.dottedName
			) {
				const faultyDottedName = error.info.dottedName as Names

				// eslint-disable-next-line no-console
				console.error(
					`Key omit from situation: "${faultyDottedName}"\n\n`,
					error
				)

				situation = omit(situation, faultyDottedName) as typeof rawSituation

				onError?.({ faultyDottedName, situation })
			} else {
				// eslint-disable-next-line no-console
				console.error('safeSituationCatch', error)
			}
		}
	} while (situationError && errors.length < 1000)
}
