import rawRules, { DottedName } from 'modele-social'
import Engine, { Rule } from 'publicodes'

import type { ProviderProps } from '@/components/Provider'

import i18n from './locales/i18n'
import ruleTranslations from './locales/rules-en.yaml'
import translateRules from './locales/translateRules'

type Rules = Record<DottedName, Rule>

const unitsTranslations = Object.entries(
	i18n.getResourceBundle('fr', 'units') as Record<string, string>
)
const engineOptions = {
	getUnitKey(unit: string): string {
		const key = unitsTranslations
			.find(([, trans]) => trans === unit)?.[0]
			.replace(/_plural$/, '')

		return key || unit
	},
}

let warnCount = 0
let timeout: NodeJS.Timeout | null = null
const logger = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	warn: (message: string) => {
		// console.warn(message)

		warnCount++
		timeout !== null && clearTimeout(timeout)
		timeout = setTimeout(() => {
			// eslint-disable-next-line no-console
			console.warn('⚠️', warnCount, 'warnings in the engine')
			warnCount = 0
		}, 1000)
	},
	error: (message: string) => {
		// eslint-disable-next-line no-console
		console.error(message)
	},
	log: (message: string) => {
		// eslint-disable-next-line no-console
		console.log(message)
	},
}

export function engineFactory(rules: Rules, options = {}) {
	return new Engine(rules, { ...engineOptions, ...options, logger })
}

//

export type Actions =
	| {
			action: 'init'
			params: [{ basename: ProviderProps['basename'] }]
			result: void
	  }
	| {
			action: 'setSituation'
			params: Parameters<Engine<DottedName>['setSituation']>
			result: void
	  }
	| {
			action: 'evaluate'
			params: Parameters<Engine<DottedName>['evaluate']>
			result: ReturnType<Engine<DottedName>['evaluate']>
	  }
	| {
			action: 'getRule'
			params: Parameters<Engine<DottedName>['getRule']>
			result: ReturnType<Engine<DottedName>['getRule']>
	  }
	| {
			action: 'getParsedRules'
			params: []
			result: ReturnType<Engine<DottedName>['getParsedRules']>
	  }
	| {
			action: 'shallowCopy'
			params: []
			result: void
	  }
	| {
			action: 'deleteShallowCopy'
			params: [{ engineId: number }]
			result: void
	  }

type GenericParams = {
	/**
	 * The id of the engine to use, the default engine is 0
	 */
	engineId?: number

	/**
	 * The id of the message, used to identify the response
	 */
	id: number
}

export type Action<T extends Actions['action']> = Extract<
	Actions,
	{ action: T }
>

let engines: (Engine<DottedName> | undefined)[] = []

let setDefaultEngineReady: (() => void) | null = null
const isDefaultEngineReady = new Promise(
	(resolve) => (setDefaultEngineReady = resolve as () => void)
)

onmessage = async (e) => {
	console.log('[onmessage]', e.data)

	const { engineId = 0, id, action, params } = e.data as Actions & GenericParams

	try {
		if (action === 'init') {
			const [{ basename }] = params
			try {
				let rules = rawRules
				if (basename === 'infrance') {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					rules = translateRules('en', ruleTranslations, rules)
				}

				const engineId = engines.length
				engines.push(engineFactory(rules))
				console.log('[engine ready]', engines[engineId])
				postMessage({ engineId, id })
				setDefaultEngineReady?.()
			} catch (e) {
				console.error('[error]', e)
				// postMessage('error')
			}

			return
		}

		await isDefaultEngineReady

		const engine = engines[engineId]
		if (!engine) {
			throw new Error('Engine does not exist')
		}

		if (action === 'setSituation') {
			// safeSetSituation(
			// 	engine,
			// 	({ situation, <faultyDottedName> }) => {
			// 		console.error('setSituation', { situation, faultyDottedName })
			// 	},
			// 	...params
			// )
			engine.setSituation(...params)

			return postMessage({ engineId, id })
		} else if (action === 'evaluate') {
			const result = engine.evaluate(...params)
			console.log('[result]', result)

			return postMessage({ engineId, id, result })
		} else if (action === 'getRule') {
			const result = engine.getRule(...params)

			return postMessage({ engineId, id, result })
		} else if (action === 'getParsedRules') {
			const result = engine.getParsedRules()

			return postMessage({ engineId, id, result })
		} else if (action === 'shallowCopy') {
			const result = engine.shallowCopy()
			engines.push(result)

			return postMessage({ engineId: engines.length - 1, id })
		} else if (action === 'deleteShallowCopy') {
			if (engineId === 0) {
				throw new Error('Cannot delete the default engine')
			}
			delete engines[engineId]

			// false positive warning from eslint
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
			const lastIndex: number = engines.findLastIndex(
				(el) => el instanceof Engine
			)
			engines = lastIndex >= 0 ? engines.splice(0, lastIndex) : engines

			console.log('[engines]', engines)

			return postMessage({ engineId, id })
		} else {
			console.log('[Message inconu]', e.data)
		}
	} catch (error) {
		return postMessage({ engineId, id, error })
	}
}
