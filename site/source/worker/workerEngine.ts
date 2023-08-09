import Engine from 'publicodes'

/**
 * This file run any publicodes engine in a web worker.
 */

export type WorkerEngineActions<
	InitParams extends unknown[] = unknown[],
	Name extends string = string,
> =
	| {
			action: 'init'
			params: InitParams
			result: number
	  }
	| {
			action: 'setSituation'
			params: Parameters<Engine<Name>['setSituation']>
			result: void
	  }
	| {
			action: 'evaluate'
			params: Parameters<Engine<Name>['evaluate']>
			result: ReturnType<Engine<Name>['evaluate']>
	  }
	| {
			action: 'getRule'
			params: Parameters<Engine<Name>['getRule']>
			result: ReturnType<Engine<Name>['getRule']>
	  }
	| {
			action: 'getParsedRules'
			params: []
			result: ReturnType<Engine<Name>['getParsedRules']>
	  }
	| {
			action: 'shallowCopy'
			params: [] // no params cause we use engineId
			result: number
	  }
	| {
			action: 'deleteShallowCopy'
			params: [] // no params cause we use engineId
			result: void
	  }

export type WorkerEngineAction<
	Actions extends WorkerEngineActions,
	Action extends Actions['action'],
> = Extract<Actions, { action: Action }>

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

type DistributiveOmit<T, K extends keyof T> = T extends unknown
	? Omit<T, K>
	: never

/**
 */
export const createWorkerEngine = <
	Name extends string = string,
	InitParams extends unknown[] = unknown[],
>(
	init: (...params: InitParams) => Engine<Name>
) => {
	type Params = DistributiveOmit<
		WorkerEngineActions<InitParams, Name> & GenericParams,
		'result'
	>

	let engines: (Engine<Name> | undefined)[] = []
	let queue: (Params & { engineId: number })[] = []

	let setDefaultEngineReady: (() => void) | null = null
	const isDefaultEngineReady = new Promise(
		(resolve) => (setDefaultEngineReady = resolve as () => void)
	)

	const actions = (
		data: Params
		// & { engines: EngineType[] }
	) => {
		const { engineId = 0, id, action, params } = data

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

			return { id }
		} else if (action === 'evaluate') {
			const result = engine.evaluate(...params)
			console.log('[result]', result)

			return { id, result }
		} else if (action === 'getRule') {
			const result = engine.getRule(...params)

			return { id, result }
		} else if (action === 'getParsedRules') {
			const result = engine.getParsedRules()

			return { id, result }
		} else if (action === 'shallowCopy') {
			engines.push(engine.shallowCopy())

			return { id, result: engines.length - 1 }
		} else if (action === 'deleteShallowCopy') {
			if (engineId === 0) {
				throw new Error('Cannot delete the default engine')
			}

			delete engines[engineId]
			engines = engines.splice(engineId, 1)

			console.log('[engines]', engines)

			return { id }
		} else {
			console.log('[unknow message]', data)

			return { id }
		}
	}

	let timeout: NodeJS.Timeout | null = null
	onmessage = async (e) => {
		console.log('[onmessage]', e.data)

		const { engineId = 0, id, action, params } = e.data as Params

		try {
			if (action === 'init') {
				// console.log('[init engine]')
				// const [{ basename }] = params
				try {
					// let rules = rawRules
					// if (basename === 'infrance') {
					// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					// 	rules = translateRules('en', ruleTranslations, rules)
					// }
					// engineFactory(rules)

					const engine = init(...params)

					const engineId = engines.length
					engines.push(engine)

					postMessage({ id, result: engineId })
					setDefaultEngineReady?.()
					console.log('[engine ready]', engines[engineId])
				} catch (e) {
					console.error('[error]', e)
					// postMessage('error')
				}

				return
			}

			await isDefaultEngineReady

			queue.push({ engineId, id, action, params } as Params & {
				engineId: number
			})

			if (timeout !== null) {
				return
			}

			// timeout !== null && clearTimeout(timeout)
			timeout = setTimeout(() => {
				const aborts: number[] = []
				const setSituationEncountered: boolean[] = []
				const filteredQueue = [...queue]
					.reverse()
					.filter(({ action, engineId, id }) => {
						if (action === 'setSituation')
							setSituationEncountered[engineId] = true

						const keep =
							!setSituationEncountered[engineId] ||
							(setSituationEncountered[engineId] && action !== 'evaluate')

						if (!keep) aborts.push(id)

						return keep
					})
					.reverse()
				console.log('[start queue]', queue, filteredQueue)

				console.time('bench')
				postMessage({
					batch: filteredQueue.map((params) => {
						try {
							const res = actions(params)

							return res
						} catch (error) {
							return { id: params.id, error }
						}
					}),
				})

				console.timeEnd('bench')
				const error = new Error(
					'aborts the action because the situation has changed'
				)
				postMessage({ batch: aborts.map((id) => ({ id, error })) })

				queue = []
				timeout = null
			}, 50)
		} catch (error) {
			return postMessage({ id, error })
		}
	}
}
