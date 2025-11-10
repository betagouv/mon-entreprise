import { Rule } from 'publicodes'

export type Translation = Record<string, string> & {
	avec?: Record<string, Translation>
}

type translateAttribute = (
	prop: string,
	rule: Rule,
	translation: Translation,
	lang: string
) => Rule

/* Traduction */
const translateSuggestion: translateAttribute = (
	prop,
	rule,
	translation,
	lang
) => ({
	...rule,
	suggestions: Object.entries(rule.suggestions!).reduce(
		(acc, [name, value]) => ({
			...acc,
			[translation[`${prop}.${name}.${lang}`]]: value,
		}),
		{}
	),
})

export const attributesToTranslate = [
	'titre',
	'description',
	'question',
	'résumé',
	'suggestions',
	'note',
	'identifiant court',
]

const translateProp =
	(lang: string, translation: Translation) =>
	(rule: Rule & { avec?: Record<string, Rule> }, prop: string) => {
		if (prop === 'suggestions' && rule?.suggestions) {
			return translateSuggestion(prop, rule, translation, lang)
		}
		const propTrans = translation[prop + '.' + lang]

		let avec
		if (
			'avec' in rule &&
			rule.avec &&
			'avec' in translation &&
			translation.avec
		) {
			avec = { avec: translateRules(lang, translation.avec, rule.avec) }
		}

		return propTrans ? { ...rule, [prop]: propTrans, ...avec } : rule
	}

function translateRule<Names extends string>(
	lang: string,
	translations: { [Name in Names]: Translation },
	name: Names,
	rule: Rule
): Rule {
	const ruleTrans = translations[name]
	if (!ruleTrans) {
		return rule
	}

	return attributesToTranslate.reduce(
		translateProp(lang, ruleTrans),
		rule ?? {}
	)
}

export default function translateRules<Names extends string>(
	lang: string,
	translations: Record<Names, Translation>,
	rules: Record<Names, Rule>
): Record<Names, Rule> {
	const translatedRules = Object.fromEntries(
		Object.entries<Rule>(rules).map(([name, rule]) => [
			name,
			rule && typeof rule === 'object'
				? translateRule(lang, translations, name, rule)
				: rule,
		])
	)

	return translatedRules as Record<Names, Rule>
}
