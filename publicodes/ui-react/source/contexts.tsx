import Engine from 'publicodes'
import React, { createContext } from 'react'
import References from './rule/References'

export type SupportedRenderers = {
	Link: React.ComponentType<{ to: string; children: React.ReactNode }>
	Head?: React.ComponentType
	References?: typeof References
}

export const BasepathContext = createContext<string>('/documentation')
export const EngineContext = createContext<Engine<string> | null>(null)
export const RenderersContext = createContext<Partial<SupportedRenderers>>({
	References,
})
