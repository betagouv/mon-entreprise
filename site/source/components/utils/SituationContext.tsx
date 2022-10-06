import Engine, { PublicodesExpression } from 'publicodes'
import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useRef,
	useState,
} from 'react'
import { safeSetSituation } from './EngineContext'

export type Situation<Names extends string> = Partial<
	Record<Names, PublicodesExpression | undefined>
>

type SetSituation<Names extends string> = Dispatch<
	SetStateAction<Situation<Names>>
>

export interface SituationState<Names extends string> {
	situation: Situation<Names>
	setSituation: SetSituation<Names>
}

/**
 * Create a situation state synchronized with engine
 * @param defaultSituation
 * @returns situation state
 */
export const useSynchronizedSituationState = <Names extends string>(
	engine: Engine<Names>,
	defaultSituation: Situation<Names> | (() => Situation<Names>) = {}
): SituationState<Names> => {
	const [localSituation, setLocalSituation] =
		useState<Situation<Names>>(defaultSituation)

	const prevSituation = useRef<Situation<Names> | null>(null)

	if (prevSituation.current !== localSituation) {
		prevSituation.current = localSituation

		safeSetSituation(engine, localSituation, ({ situation }) =>
			setLocalSituation(situation)
		)
	}

	return { situation: localSituation, setSituation: setLocalSituation }
}

export const SituationStateContext = createContext<
	Partial<SituationState<string>>
>({})

export const SituationStateProvider = SituationStateContext.Provider

export const useSituationState = <Names extends string>() =>
	useContext(SituationStateContext) as Partial<SituationState<Names>>
