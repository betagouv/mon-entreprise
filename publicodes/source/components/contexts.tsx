import { createContext } from 'react'
import Engine from '..'

export const UseDefaultValuesContext = createContext<boolean>(true)
export const BasepathContext = createContext<string>('/documentation')
export const EngineContext = createContext<Engine<string> | null>(null)
