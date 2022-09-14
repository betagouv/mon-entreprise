import { deleteFromSituation } from '@/actions/actions'
import {
	companySituationSelector,
	configSituationSelector,
	situationSelector,
} from '@/selectors/simulationSelectors'
import { omit } from '@/utils'
import { DottedName } from 'modele-social'
import Engine, {
	EvaluatedNode,
	isPublicodesError,
	PublicodesExpression,
	Rule,
	RuleNode,
} from 'publicodes'
import {
	createContext,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import i18n from '../../locales/i18n'

export type Rules = Record<DottedName, Rule>

const unitsTranslations = Object.entries(
	i18n.getResourceBundle('fr', 'units') as Record<string, string>
)
const engineOptions = {
	getUnitKey(unit: string): string {
		const key = unitsTranslations
			.find(([, trans]) => trans === unit)?.[0]
			.replace(/_plural$/, '')

		return key || unit
	},
}

export function engineFactory(rules: Rules, options = {}) {
	return new Engine(rules, { ...engineOptions, ...options })
}

export const EngineContext = createContext<Engine>(new Engine())
export const EngineProvider = EngineContext.Provider

export function useEngine() {
	return useContext(EngineContext) as Engine<DottedName>
}

export const useRawSituation = () => {
	const simulatorSituation = useSelector(situationSelector)
	const configSituation = useSelector(configSituationSelector)
	const companySituation = useSelector(companySituationSelector)

	const situation: Partial<Record<DottedName, PublicodesExpression>> = useMemo(
		() => ({
			...companySituation,
			...configSituation,
			...simulatorSituation,
		}),
		[configSituation, simulatorSituation, companySituation]
	)

	return situation
}

export const useSetupSafeSituation = (engine: Engine<DottedName>) => {
	const dispatch = useDispatch()
	const rawSituation = useRawSituation()

	// Try to set situation and delete all rules with syntax error
	let situationError = false
	let maxLoopCount = 1000
	let situation = { ...rawSituation } as typeof rawSituation
	do {
		try {
			engine.setSituation(situation)
			situationError = false
		} catch (error) {
			situationError = true
			maxLoopCount--

			if (isPublicodesError(error, 'SyntaxError')) {
				const faultyDottedName = error.info.dottedName as DottedName

				// eslint-disable-next-line no-console
				console.error(
					`Key omit from situation: "${faultyDottedName}"\n\n`,
					error
				)

				// Hack: Omit faultyDottedName from situation for next loop
				situation = omit(situation, faultyDottedName)

				dispatch(deleteFromSituation(faultyDottedName))
			} else {
				// eslint-disable-next-line no-console
				console.error('safeSituationCatch', error)
			}
		}
	} while (situationError && maxLoopCount > 0)
}

export function useInversionFail() {
	return useContext(EngineContext).inversionFail()
}

export type EvaluatedRule = EvaluatedNode &
	RuleNode & { dottedName: DottedName }
