import Engine, {
	EvaluatedNode,
	isPublicodesError,
	PublicodesExpression,
	RuleNode,
} from 'publicodes'
import { createContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'
import { deleteFromSituation } from '@/store/actions/actions'
import { companySituationSelector } from '@/store/selectors/companySituation.selector'
import {
	completeSituationSelector,
	configObjectifsSelector,
	configSituationSelector,
	situationSelector,
} from '@/store/selectors/simulationSelectors'
import { omit } from '@/utils'

export const EngineContext = createContext<Engine>(new Engine())
export const EngineProvider = EngineContext.Provider

export const useRawSituation = () => useSelector(completeSituationSelector)

/**
 * Try to set situation and delete all rules with syntax/evaluation error
 */
export const safeSetSituation = <Names extends string>(
	engine: Engine<Names>,
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
			engine.setSituation(situation)
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

export const useSetupSafeSituation = (engine: Engine<DottedName>) => {
	const dispatch = useDispatch()
	const rawSituation = useRawSituation()

	const simulatorSituation = useSelector(situationSelector)
	const configSituation = useSelector(configSituationSelector)
	const companySituation = useSelector(companySituationSelector)

	try {
		safeSetSituation(engine, rawSituation, ({ faultyDottedName }) => {
			if (!faultyDottedName) {
				throw new Error('Bad empty faultyDottedName')
			}

			if (faultyDottedName in simulatorSituation) {
				dispatch(deleteFromSituation(faultyDottedName))
			} else {
				throw new Error(
					'Bad ' +
						(faultyDottedName in configSituation
							? 'config'
							: faultyDottedName in companySituation
							? 'company'
							: 'unknow') +
						' situation : ' +
						JSON.stringify(faultyDottedName)
				)
			}
		})
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)

		engine.setSituation()
	}
}

export function useInversionFail() {
	const engine = useEngine()
	const objectifs = useSelector(configObjectifsSelector).map(
		(objectif) => engine.evaluate(objectif).nodeValue
	)

	const inversionFail =
		engine.inversionFail() && objectifs.some((o) => o === undefined)

	return false

	return inversionFail
}

export type EvaluatedRule = EvaluatedNode &
	RuleNode & { dottedName: DottedName }
