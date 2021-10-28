import Engine from 'publicodes'
import { createContext } from 'react'

export const BasepathContext = createContext<string>('/documentation')
export const EngineContext = createContext<Engine<string> | null>(null)
export const ReferencesImagesContext = createContext<Record<string, string>>({})
