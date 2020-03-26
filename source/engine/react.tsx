import Value from 'Components/Value'
import rules from 'Publicode/rules'
import React, { createContext, useContext, useMemo } from 'react'
import Engine from '.'
export const EngineContext = createContext<{
	engine: Engine | null
	error: string | null
}>({ engine: new Engine({ rules }), error: null })

type InputProps = {
	rules?: any
	situation?: any
	children: React.ReactNode
}

export function Provider({ rules, situation, children }: InputProps) {
	const [engine, error] = useMemo(() => {
		try {
			return [new Engine({ rules }), null]
		} catch (err) {
			return [null, (err?.message ?? err.toString()) as string]
		}
	}, [rules])
	if (engine !== null && !Object.is(situation, engine.situation)) {
		engine.setSituation(situation)
	}
	return (
		<EngineContext.Provider value={{ engine, error }}>
			{children}
		</EngineContext.Provider>
	)
}

export function useEvaluation(expression: string) {
	const { engine } = useContext(EngineContext)
	return engine === null ? null : engine.evaluate(expression)
}

export function useError() {
	return useContext(EngineContext).error
}

export function Evaluation({ expression }) {
	const value = useEvaluation(expression)
	return value === null ? null : <Value {...value} />
}

export default {
	Provider,
	useEvaluation,
	useError,
	Evaluation
}
