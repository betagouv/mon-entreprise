import { DottedName } from 'modele-social'
import Engine, { PublicodesExpression, Rule } from 'publicodes'
import { createContext, default as React, useContext } from 'react'
import i18n from '../../locales/i18n'

export type Rules = Record<DottedName, Rule>

const unitsTranslations = Object.entries(i18n.getResourceBundle('fr', 'units'))
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
	engine.setSituation(situation)

	return (
		<EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
	)
}

export function useInversionFail() {
	return useContext(EngineContext).inversionFail()
}
