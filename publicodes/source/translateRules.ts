import { assoc, mapObjIndexed } from 'ramda'
import { Rule } from './rule'

type Translation = Record<string, string>
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
) =>
	assoc(
		'suggestions',
		Object.entries(rule.suggestions!).reduce(
			(acc, [name, value]) => ({
				...acc,
				[translation[`${prop}.${name}.${lang}`]?.replace(
					/^\[automatic\] /,
					''
				)]: value,
			}),
			{}
		),
		rule
	)

export const attributesToTranslate = [
	'titre',
	'description',
	'question',
	'résumé',
	'suggestions',
	'note',
]

const translateProp = (lang: string, translation: Translation) => (
	rule: Rule,
	prop: string
) => {
	if (prop === 'suggestions' && rule?.suggestions) {
		return translateSuggestion(prop, rule, translation, lang)
	}
	let propTrans = translation[prop + '.' + lang]
	propTrans = propTrans?.replace(/^\[automatic\] /, '')
	return propTrans ? assoc(prop, propTrans, rule) : rule
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

export default function translateRules(
	lang: string,
	translations: Record<string, Translation>,
	rules: Record<string, Rule>
): Record<string, Rule> {
	const translatedRules = mapObjIndexed(
		(rule: Rule, name: string) => translateRule(lang, translations, name, rule),
		rules
	)

	return translatedRules
}
