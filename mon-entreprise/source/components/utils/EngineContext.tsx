import Engine, { EvaluatedRule, EvaluationOptions } from 'publicodes'
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState
} from 'react'
import { setConfig } from 'react-hot-loader'
import { DottedName } from 'Rules'

export const EngineContext = createContext<Engine<DottedName>>(null as any)

export const EngineProvider = EngineContext.Provider

type SituationProviderProps = {
	children: React.ReactNode
	situation: Partial<
		Record<DottedName, string | number | Record<string, unknown>>
	>
}
const SituationContext = createContext()

export function SituationProvider({
	children,
	situation: situationProp
}: SituationProviderProps) {
	const engine = useContext(EngineContext)
	const [situation, setSituation] = useState(situationProp)
	const deferedSituation = React.unstable_useDeferredValue(situationProp, {
		timeoutMS: 2000
	})
	useEffect(() => {
		engine.setSituation(deferedSituation)
		setSituation(deferedSituation)
	}, [deferedSituation])
	return (
		<SituationContext.Provider value={situation}>
			<EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
		</SituationContext.Provider>
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
	const situation = useContext(SituationContext)
	if (Array.isArray(rule)) {
		return rule.map(name => engine.evaluate(name, options))
	}
	return useMemo(() => engine.evaluate(rule, options), [situation])
}

export function useInversionFail() {
	return useContext(EngineContext).inversionFail()
}
