import { createContext } from 'react'
import Engine from 'publicodes'

export const BasepathContext = createContext<string>('/documentation')
export const EngineContext = createContext<Engine<string> | null>(null)
export const ReferencesImagesContext = createContext<Record<string, string>>({})
