import Engine, { EngineOptions } from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { Rules } from '@/domaine/publicodes/Rules'
import { NomModèle } from '@/domaine/SimulationConfig'
import i18next from '@/locales/i18n'
import ruleTranslationsAS from '@/locales/rules-as-en.yaml'
import ruleTranslations from '@/locales/rules-en.yaml'
import ruleTranslationsTI from '@/locales/rules-ti-en.yaml'
import translateRules, { Translation } from '@/locales/translateRules'

const unitsTranslations = Object.entries(
	i18next.getResourceBundle('fr', 'units') as Record<string, string>
)

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
	logger,
}

export function engineFactory(rules: Rules, nomModèle?: NomModèle) {
	const translatedRules =
		i18next.language === 'en'
			? translateRules('en', getRuleTranslations(nomModèle), rules)
			: rules

	return new Engine(translatedRules, engineOptions) as Engine<DottedName>
}

const getRuleTranslations = <Names extends string>(nomModèle?: NomModèle) => {
	switch (nomModèle) {
		case 'modele-as':
			return ruleTranslationsAS as Record<Names, Translation>
		case 'modele-ti':
			return ruleTranslationsTI as Record<Names, Translation>
		default:
			return ruleTranslations as Record<Names, Translation>
	}
}
