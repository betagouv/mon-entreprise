import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

/*
  Return the ordinal localized string (first, second, etc...)
*/

const suffixes = {
	en: {
		one: 'st',
		two: 'nd',
		few: 'rd',
		other: 'th',
	},
	fr: {
		one: 'ère',
		other: 'ème',
	},
}

export function useOrdinal(n: number): string {
	const language = useTranslation().i18n.language
	if (language !== 'fr' && language !== 'en') {
		throw new Error(`Le language ${language} n'est pas supporté`)
	}

	const pr = useMemo(
		() => new Intl.PluralRules(language, { type: 'ordinal' }),
		[language]
	)

	const rule = pr.select(n)
	const suffix: Partial<Record<Intl.LDMLPluralRule, string>> =
		suffixes[language]
	if (!(rule in suffix)) {
		throw new Error(
			`Le cardinal de ${n} n'est pas défini dans le langage ${language}`
		)
	}

	return `${n}${suffix[rule] ?? ''}`
}
