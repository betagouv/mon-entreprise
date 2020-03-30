import { assoc, mapObjIndexed } from 'ramda'
import { Rule, Rules } from './types'

/* Traduction */
const translateContrôle = (prop, rule, translation, lang) =>
	assoc(
		'contrôles',
		rule.contrôles.map((control, i) => ({
			...control,
			message: translation[`${prop}.${i}.${lang}`]?.replace(
				/^\[automatic\] /,
				''
			)
		})),
		rule
	)

const translateSuggestion = (prop, rule, translation, lang) =>
	assoc(
		'suggestions',
		Object.entries(rule.suggestions).reduce(
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

const translateProp = (lang: string, translation: Object) => (
	rule: Rule,
	prop
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
	translations: { [Name in Names]: Object },
	name: Names,
	rule: Rule
): Rule {
	let ruleTrans = translations[name]
	if (!ruleTrans) {
		return rule
	}
	return attributesToTranslate.reduce(
		translateProp(lang, ruleTrans),
		rule ?? {}
	) as Rule
}

export default function translateRules<Names extends string>(
	lang: string,
	translations: { [Name in Names]: Object },
	rules: Rules<Names>
): Rules<Names> {
	const translatedRules = mapObjIndexed(
		(rule: Rule, name: Names) =>
			translateRule(lang, translations, name, rule as Rule),
		rules
	)

	return translatedRules as Rules<Names>
}
