import Value from 'Components/Value'
import React, { createContext, useContext, useMemo, useState } from 'react'
import Engine from '.'

const EngineContext = createContext<{
	engine: Engine | null
	error: string | null
}>({ engine: new Engine(), error: null })

type InputProps = {
	rules?: any
	situation?: any
	children: React.ReactNode
}

export function Provider({ rules, situation, children }: InputProps) {
	const [error, setError] = useState<string | null>(null)
	const engine = useMemo(() => {
		try {
			setError(null)
			return new Engine({ rules })
		} catch (err) {
			setError(err?.message ?? err.toString())
			return null
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
