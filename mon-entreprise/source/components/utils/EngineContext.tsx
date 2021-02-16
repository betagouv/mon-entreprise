import Engine, { Rule } from 'publicodes'
import React, { createContext, useContext } from 'react'
import { DottedName } from 'modele-social'
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
	formatUnit(unit: string, count: number): string {
		return i18n?.t(`units:${unit}`, { count })
	},
}
export function engineFactory(rules: Rules) {
	return new Engine(rules, engineOptions)
}

export const EngineContext = createContext<Engine>(new Engine())
export const EngineProvider = EngineContext.Provider

export function useEngine(): Engine<DottedName> {
	return useContext(EngineContext) as Engine<DottedName>
}

type SituationProviderProps = {
	children: React.ReactNode
	situation: Partial<
		Record<DottedName, string | number | Record<string, unknown>>
	>
}
export function SituationProvider({
	children,
	situation,
}: SituationProviderProps) {
	const engine = useContext(EngineContext)
	engine.setSituation(situation)
	return (
		<EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
	)
}
export function useInversionFail() {
	return useContext(EngineContext).inversionFail()
}
