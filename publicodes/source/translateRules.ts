import { assoc, mapObjIndexed } from 'ramda'
import { RuleNode } from './rule'

type Translation = Record<string, string>
type translateAttribute = (
	prop: string,
	rule: RuleNode,
	translation: Translation,
	lang: string
) => RuleNode

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
				)]: value
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
	'note'
]

const translateProp = (lang: string, translation: Translation) => (
	rule: RuleNode,
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
	rule: RuleNode
): RuleNode {
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
	rules: Record<string, RuleNode>
): Record<string, RuleNode> {
	const translatedRules = mapObjIndexed(
		(rule: RuleNode, name: string) =>
			translateRule(lang, translations, name, rule),
		rules
	)

	return translatedRules
}
