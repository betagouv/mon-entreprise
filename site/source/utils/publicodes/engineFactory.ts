import Engine, { EngineOptions } from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { Rules } from '@/domaine/publicodes/Rules'
import translateRules from '@/locales/translateRules'

import i18next from '../../locales/i18n'
import ruleTranslations from '../../locales/rules-en.yaml'

const unitsTranslations = Object.entries(
	i18next.getResourceBundle('fr', 'units') as Record<string, string>
)

const engineOptions: EngineOptions = {
	getUnitKey(unit: string): string {
		const key = unitsTranslations
			.find(([, trans]) => trans === unit)?.[0]
			.replace(/_plural$/, '')

		return key || unit
	},
	warn:
		process.env.NODE_ENV === 'production'
			? false
			: {
					experimentalRules: false,
					deprecatedSyntax: false,
			  },
}

let timeout: NodeJS.Timeout | null = null
let logs: ['warn' | 'error' | 'log', string][] = []

const logger = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	warn: (message: string) => {
		// console.warn(message)
		logs.push(['warn', message])

		timeout !== null && clearTimeout(timeout)
		timeout = setTimeout(() => {
			// eslint-disable-next-line no-console
			console.groupCollapsed('Publicodes logs')
			logs.forEach(([type, message]) => {
				// eslint-disable-next-line no-console
				console[type](message)
			})
			console.groupEnd()
			logs = []
		}, 1000)
	},
	error: (message: string) => {
		// eslint-disable-next-line no-console
		logs.push(['error', message])
		console.error(message)
	},
	log: (message: string) => {
		// eslint-disable-next-line no-console
		logs.push(['log', message])
		console.log(message)
	},
}

export function engineFactory(rules: Rules, options = {}) {
	const translatedRules =
		i18next.language === 'en'
			? translateRules('en', ruleTranslations, rules)
			: rules

	return new Engine(translatedRules, {
		...engineOptions,
		...options,
		logger,
	}) as Engine<DottedName>
}
