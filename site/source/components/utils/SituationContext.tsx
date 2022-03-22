import Engine, { PublicodesExpression } from 'publicodes'
import {
	createContext,
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useState,
} from 'react'
import { useEngine } from './EngineContext'

export type Situation<Names extends string> = Partial<
	Record<Names, PublicodesExpression | undefined>
>

type SetSituation<Names extends string> = Dispatch<
	SetStateAction<Situation<Names>>
>

export interface SituationState<Names extends string> {
	engine: Engine<Names>
	situation: Situation<Names>
	setSituation: SetSituation<Names>
}

export const useCreateSituationState = <Names extends string>(
	defaultSituation: Situation<Names> | (() => Situation<Names>) = {}
): SituationState<Names> => {
	const engine = useEngine<Names>()

	const [localSituation, setLocalSituation] = useState<Situation<Names>>(() => {
		if (typeof defaultSituation === 'function') {
			const newSituation = defaultSituation()
			engine.setSituation(newSituation)

			return newSituation
		} else {
			engine.setSituation(defaultSituation)

			return defaultSituation
		}
	})

	const setSituation = useCallback(
		(value: SetStateAction<Situation<Names>>) => {
			if (typeof value === 'function') {
				return setLocalSituation((val) => {
					const newSituation = value(val)
					engine.setSituation(newSituation)

					return newSituation
				})
			} else {
				engine.setSituation(value)

				return setLocalSituation(value)
			}
		},
		[engine]
	)

	return { engine, situation: localSituation, setSituation }
}

export const SituationStateContext = createContext<
	Partial<SituationState<string>>
>({})
export const SituationStateProvider = SituationStateContext.Provider

export const useSituationState = <Names extends string>() =>
	useContext(SituationStateContext) as Partial<SituationState<Names>>
