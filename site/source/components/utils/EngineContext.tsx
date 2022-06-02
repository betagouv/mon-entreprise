import { deleteFromSituation } from '@/actions/actions'
import { omit } from '@/utils'
import { DottedName } from 'modele-social'
import Engine, { PublicodesExpression, Rule } from 'publicodes'
import { createContext, useContext } from 'react'
import { useDispatch } from 'react-redux'
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

type SituationProviderProps<Names extends string> = {
	children: React.ReactNode
	situation: Partial<Record<Names, PublicodesExpression>>
}

export function SituationProvider<Names extends string = DottedName>({
	children,
	situation,
}: SituationProviderProps<Names>) {
	const engine = useContext(EngineContext)
	const dispatch = useDispatch()

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

				// Hack: Omit faultyDottedName from situation
				situation = omit(
					situation,
					faultyDottedName as Names
				) as typeof situation
				// Delete faultyDottedName from redux store
				dispatch(deleteFromSituation(faultyDottedName as DottedName))
			}
		}
	}

	return (
		<EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
	)
}

export function useInversionFail() {
	return useContext(EngineContext).inversionFail()
}
