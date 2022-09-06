import { deleteFromSituation } from '@/actions/actions'
import {
	companySituationSelector,
	configSituationSelector,
	situationSelector,
} from '@/selectors/simulationSelectors'
import { DottedName } from 'modele-social'
import Engine, {
	EvaluatedNode,
	PublicodesExpression,
	Rule,
	RuleNode,
} from 'publicodes'
import { createContext, useContext, useMemo } from 'react'
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
	const situation = useRawSituation()

	let loop = true
	while (loop) {
		try {
			engine.setSituation(situation)
			loop = false
		} catch (error) {
			const errorStr = (error as Error).toString()
			const faultyDottedName = ((/Erreur syntaxique/.test(errorStr) &&
				errorStr.match(/"[^"[]*\[([^"\]]*)\][^"\]]*"/)) ||
				null)?.[1]

			if (faultyDottedName == null) {
				loop = false
				// eslint-disable-next-line no-console
				console.error(error)
			} else {
				// eslint-disable-next-line no-console
				console.error(
					'Key omit from situation:',
					`"${faultyDottedName}"\n\n`,
					error
				)

				// Delete faultyDottedName from redux store
				dispatch(deleteFromSituation(faultyDottedName as DottedName))
			}
		}
	}
}

export function useInversionFail() {
	return useContext(EngineContext).inversionFail()
}

export type EvaluatedRule = EvaluatedNode &
	RuleNode & { dottedName: DottedName }
