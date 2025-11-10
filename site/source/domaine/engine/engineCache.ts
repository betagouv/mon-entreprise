import Engine, { Situation } from 'publicodes'

import { chargeModèle } from '@/utils/chargeModèle'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import { DottedName } from '../publicodes/DottedName'
import { NomModèle } from '../SimulationConfig'

type EngineCacheEntry = {
	engine?: Engine<DottedName>
	promise?: Promise<Engine<DottedName>>
}

const cache = new Map<NomModèle, EngineCacheEntry>()

export const getCachedEngine = (
	nomModèle: NomModèle
): Engine<DottedName> | undefined => cache.get(nomModèle)?.engine

export const setEngineSituation = (
	nomModèle: NomModèle,
	situation: Situation<DottedName>
): void => {
	const engine = getCachedEngine(nomModèle)
	engine?.setSituation(situation)
}

export const getOrCreateEnginePromise = (
	nomModèle: NomModèle
): Promise<Engine<DottedName>> => {
	const existing = cache.get(nomModèle)

	if (existing?.engine) {
		return Promise.resolve(existing.engine)
	}

	if (existing?.promise) {
		return existing.promise
	}

	const promise = chargeModèle(nomModèle)
		.then((modèle) => {
			const engine = engineFactory(modèle.default, nomModèle)
			cache.set(nomModèle, {
				engine,
			})

			return engine
		})
		.catch((error) => {
			throw error
		})

	cache.set(nomModèle, {
		promise,
	})

	return promise
}

export const loadEngine = (nomModèle: NomModèle) => {
	let status: 'pending' | 'success' | 'error' = 'pending'
	let result: Engine<DottedName>
	let errorMessage: string | undefined

	const promise = getOrCreateEnginePromise(nomModèle)
		.then((engine: Engine<DottedName>) => {
			status = 'success'
			result = engine

			return engine
		})
		.catch((error: Error) => {
			status = 'error'
			errorMessage =
				(error instanceof Error ? error.message : String(error)) ??
				'Erreur inconnue'

			throw error
		})

	return {
		read() {
			if (status === 'error') {
				throw new Error(errorMessage)
			}

			if (status === 'success') {
				return result
			}

			throw promise
		},
	}
}
