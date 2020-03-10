import Value from 'Components/Value'
import React, { createContext, useContext, useMemo } from 'react'
import Engine from '.'

const EngineContext = createContext(new Engine())

type InputProps = {
	rules?: any
	situation?: any
	children: React.ReactNode
}

export function Provider({ rules, situation, children }: InputProps) {
	const engine = useMemo(() => new Engine({ rules }), [rules])
	if (!Object.is(situation, engine.situation)) {
		engine.setSituation(situation)
	}
	return (
		<EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
	)
}

export function useEvaluation(expression: string) {
	const engine = useContext(EngineContext)
	return engine.evaluate(expression)
}

export function Evaluation({ expression }) {
	const value = useEvaluation(expression)
	return <Value {...value} />
}

export default {
	Provider,
	useEvaluation,
	Evaluation
}
