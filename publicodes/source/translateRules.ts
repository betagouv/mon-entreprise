import { assoc, mapObjIndexed } from 'ramda'
import { Rule, Rules } from './types'

type Translation = Record<string, string>
type translateAttribute = (
	prop: string,
	rule: Rule,
	translation: Translation,
	lang: string
) => Rule

/* Traduction */
const translateContrôle: translateAttribute = (prop, rule, translation, lang) =>
	assoc(
		'contrôles',
		rule.contrôles!.map((control, i) => ({
			...control,
			message: translation[`${prop}.${i}.${lang}`]?.replace(
				/^\[automatic\] /,
				''
			)
		})),
		rule
	)

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
	'contrôles',
	'note'
]

const translateProp = (lang: string, translation: Translation) => (
	rule: Rule,
	prop: string
) => {
	if (prop === 'contrôles' && rule?.contrôles) {
		return translateContrôle(prop, rule, translation, lang)
	}
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

export default function translateRules<Names extends string>(
	lang: string,
	translations: { [Name in Names]: Translation },
	rules: Rules<Names>
): Rules<Names> {
	const translatedRules = mapObjIndexed(
		(rule: Rule, name: Names) => translateRule(lang, translations, name, rule),
		rules
	)

	return translatedRules
}
