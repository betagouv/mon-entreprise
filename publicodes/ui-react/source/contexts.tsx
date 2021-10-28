import Engine from 'publicodes'
import React, { createContext } from 'react'

export type SupportedRenderers = {
	Head?: React.ComponentType
	Link: React.ComponentType<{ to: string }>
}

export const BasepathContext = createContext<string>('/documentation')
export const EngineContext = createContext<Engine<string> | null>(null)
export const ReferencesImagesContext = createContext<Record<string, string>>({})
export const RenderersContext = createContext<Partial<SupportedRenderers>>({})
