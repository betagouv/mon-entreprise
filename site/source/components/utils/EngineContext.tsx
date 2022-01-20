import { DottedName } from 'modele-social'
import Engine, { Rule } from 'publicodes'
import React, { createContext, useContext } from 'react'
import i18n from '../../locales/i18n'
import { Situation } from 'Reducers/rootReducer'

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

export let engine = new Engine()

export function engineFactory(rules: Rules) {
	engine = new Engine(rules, engineOptions)
	return engine
}

export const EngineContext = createContext<Engine>(engine)
export const EngineProvider = EngineContext.Provider

export function useEngine(): Engine<DottedName> {
	return useContext(EngineContext) as Engine<DottedName>
}

type SituationProviderProps = {
	children: React.ReactNode
	situation: Situation
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
