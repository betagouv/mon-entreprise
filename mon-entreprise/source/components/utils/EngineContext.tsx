import Engine, { EvaluationOptions } from 'publicodes'
import { EvaluatedRule } from 'publicodes'
import React, { createContext, useContext } from 'react'
import rules, { DottedName } from 'Rules'

export const EngineContext = createContext<Engine<DottedName>>(
	new Engine(rules)
)

export const EngineProvider = EngineContext.Provider

type SituationProviderProps = {
	children: React.ReactNode
	situation: Partial<Record<DottedName, string | number | object>>
}
export function SituationProvider({
	children,
	situation
}: SituationProviderProps) {
	const engine = useContext(EngineContext)
	engine.setSituation(situation)
	return (
		<EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
	)
}

export function useEvaluation(
	rule: DottedName,
	options?: EvaluationOptions
): EvaluatedRule<DottedName>
export function useEvaluation(
	rule: DottedName[],
	options?: EvaluationOptions
): EvaluatedRule<DottedName>[]
export function useEvaluation(
	rule: Array<DottedName> | DottedName,
	options?: EvaluationOptions
): Array<EvaluatedRule<DottedName>> | EvaluatedRule<DottedName> {
	const engine = useContext(EngineContext)
	if (Array.isArray(rule)) {
		return rule.map(name => engine.evaluate(name, options))
	}
	return engine.evaluate(rule, options)
}

export function useInversionFail() {
	return useContext(EngineContext).inversionFail()
}

export function useControls() {
	return useContext(EngineContext).controls()
}
