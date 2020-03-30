import { assoc } from 'ramda'

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

const translateProp = (lang, translation) => (rule, prop) => {
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

const translateRule = (lang, translations, name, rule) => {
	let ruleTrans = translations[name]
	if (!ruleTrans) {
		return rule
	}
	return attributesToTranslate.reduce(
		translateProp(lang, ruleTrans),
		rule ?? {}
	)
}

export default function translateRules(lang, translations, rules) {
	const translatedRules = Object.fromEntries(
		Object.entries(rules).map(([name, rule]) => [
			name,
			translateRule(lang, translations, name, rule)
		])
	)
	return translatedRules
}
