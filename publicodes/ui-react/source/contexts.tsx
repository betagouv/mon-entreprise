import Engine from 'publicodes'
import { createContext } from 'react'

export const BasepathContext = createContext<string>('/documentation')
export const SituationMetaContext = createContext<{ name: string } | undefined>(
	undefined
)
export const EngineContext = createContext<Engine<string> | null>(null)
export const RegisterEngineContext = createContext<(engine: Engine) => void>(
	() => {}
)
export const ReferencesImagesContext = createContext<Record<string, string>>({})
