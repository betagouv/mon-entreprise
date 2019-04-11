// Séparation artificielle, temporaire, entre ces deux types de règles
import formValueTypes from 'Components/conversation/formValueTypes'
import {
	assoc,
	chain,
	dropLast,
	find,
	fromPairs,
	has,
	identity,
	is,
	isNil,
	join,
	last,
	map,
	mapObjIndexed,
	path,
	pipe,
	propEq,
	props,
	range,
	reduce,
	reduced,
	reject,
	split,
	take,
	toPairs,
	trim,
	when
} from 'ramda'
import rawRules from 'Règles/base.yaml'
import translations from 'Règles/externalized.yaml'
// TODO - should be in UI, not engine
import { capitalise0 } from '../utils'
import marked from './marked'
import possibleVariableTypes from './possibleVariableTypes.yaml'

// console.log('rawRules', rawRules.map(({espace, nom}) => espace + nom))
/***********************************
 Méthodes agissant sur une règle */

// Enrichissement de la règle avec des informations évidentes pour un lecteur humain
export let enrichRule = rule => {
	try {
		let type = possibleVariableTypes.find(t => has(t, rule) || rule.type === t),
			name = rule['nom'],
			title = capitalise0(rule['titre'] || name),
			ns = rule['espace'],
			dottedName = buildDottedName(rule),
			subquestionMarkdown = rule['sous-question'],
			subquestion = subquestionMarkdown && marked(subquestionMarkdown),
			defaultValue = rule['par défaut'],
			examples = rule['exemples'],
			icon = rule['icônes'],
			shortDescription = rule['description courte']

		return {
			...rule,
			type,
			name,
			title,
			ns,
			dottedName,
			subquestion,
			defaultValue,
			raw: rule,
			examples,
			icon,
			shortDescription
		}
	} catch (e) {
		console.log(e)
		throw new Error('Problem enriching ' + JSON.stringify(rule))
	}
}

export let buildDottedName = rule =>
	rule['espace'] ? [rule['espace'], rule['nom']].join(' . ') : rule['nom']

// les variables dans les tests peuvent être exprimées relativement à l'espace de nom de la règle,
// comme dans sa formule
export let disambiguateExampleSituation = (rules, rule) =>
	pipe(
		toPairs,
		map(([k, v]) => [disambiguateRuleReference(rules, rule, k), v]),
		fromPairs
	)

export let hasKnownRuleType = rule => rule && enrichRule(rule).type

export let splitName = split(' . '),
	joinName = join(' . ')

export let parentName = pipe(
	splitName,
	dropLast(1),
	joinName
)
export let nameLeaf = pipe(
	splitName,
	last
)

export let encodeRuleName = name =>
	encodeURI(name.replace(/\s\.\s/g, '/').replace(/\s/g, '-'))
export let decodeRuleName = name =>
	decodeURI(name.replace(/\//g, ' . ').replace(/-/g, ' '))

export let ruleParents = dottedName => {
	let fragments = splitName(dottedName) // dottedName ex. [CDD . événements . rupture]
	return range(1, fragments.length)
		.map(nbEl => take(nbEl)(fragments))
		.reverse() //  -> [ [CDD . événements . rupture], [CDD . événements], [CDD] ]
}
/* Les variables peuvent être exprimées dans la formule d'une règle relativement à son propre espace de nom, pour une plus grande lisibilité. Cette fonction résoud cette ambiguité.
 */
export let disambiguateRuleReference = (
	allRules,
	{ dottedName, name },
	partialName
) => {
	let pathPossibilities = [
			[], // the top level namespace
			...ruleParents(dottedName), // the parents namespace
			splitName(dottedName) // the rule's own namespace
		],
		found = reduce(
			(res, path) =>
				when(is(Object), reduced)(
					do {
						let dottedNameToCheck = [...path, partialName].join(' . ')
						findRuleByDottedName(allRules, dottedNameToCheck)
					}
				),
			null,
			pathPossibilities
		)

	return (
		(found && found.dottedName) ||
		do {
			throw new Error(
				`OUUUUPS la référence '${partialName}' dans la règle '${name}' est introuvable dans la base`
			)
		}
	)
}

export let collectDefaults = pipe(
	map(props(['dottedName', 'defaultValue'])),
	reject(([, v]) => v === undefined),
	fromPairs
)

/****************************************
 Méthodes de recherche d'une règle */

export let findRuleByName = (allRules, query) =>
	allRules.find(({ name }) => name === query)

export let findRulesByName = (allRules, query) =>
	allRules.filter(({ name }) => name === query)

export let searchRules = searchInput =>
	rules
		.filter(
			rule =>
				rule &&
				hasKnownRuleType(rule) &&
				JSON.stringify(rule)
					.toLowerCase()
					.indexOf(searchInput) > -1
		)
		.map(enrichRule)

export let findRuleByDottedName = (allRules, dottedName) => {
	return allRules.find(rule => rule.dottedName == dottedName)
}

export let findRule = (rules, nameOrDottedName) =>
	nameOrDottedName.includes(' . ')
		? findRuleByDottedName(rules, nameOrDottedName)
		: findRuleByName(rules, nameOrDottedName)

export let findRuleByNamespace = (allRules, ns) =>
	allRules.filter(propEq('ns', ns))

/*********************************
 Autres */

export let queryRule = rule => query => path(query.split(' . '))(rule)

// Redux-form stores the form values as a nested object
// This helper makes a dottedName => value Map
export let nestedSituationToPathMap = situation => {
	if (situation == undefined) return {}
	let rec = (o, currentPath) =>
		typeof o === 'object'
			? chain(([k, v]) => rec(v, [...currentPath, trim(k)]), toPairs(o))
			: [[currentPath.join(' . '), o + '']]

	return fromPairs(rec(situation, []))
}

export let formatInputs = (flatRules, pathValueMap) =>
	mapObjIndexed((value, path) => {
		// Our situationGate retrieves data from the "conversation" form
		// The search below is to apply input conversions such as replacing "," with "."
		if (name.startsWith('sys.')) return null

		let rule = findRuleByDottedName(flatRules, path),
			format = rule ? formValueTypes[rule.format] : null,
			pre = format && format.validator.pre ? format.validator.pre : identity

		return pre(value)
	}, pathValueMap)

/* Traduction */

export let translateAll = (translations, flatRules) => {
	let translationsOf = rule => translations[buildDottedName(rule)],
		translateProp = (lang, translation) => (rule, prop) => {
			let propTrans = translation[prop + '.' + lang]
			if (prop === 'suggestions' && propTrans)
				return assoc(
					'suggestions',
					pipe(
						toPairs,
						map(([key, translatedKey]) => [
							translatedKey,
							rule.suggestions[key]
						]),
						fromPairs
					)(propTrans),
					rule
				)
			return propTrans ? assoc(prop, propTrans, rule) : rule
		},
		translateRule = (lang, translations, props) => rule => {
			let ruleTrans = translationsOf(rule)
			return ruleTrans
				? reduce(translateProp(lang, ruleTrans), rule, props)
				: rule
		}

	let targets = [
		'titre',
		'description',
		'question',
		'description courte',
		'sous-question',
		'résumé',
		'suggestions',
		'contrôles'
	]

	return map(translateRule('en', translations, targets), flatRules)
}

// On enrichit la base de règles avec des propriétés dérivées de celles du YAML
export let rules = translateAll(translations, rawRules).map(rule =>
	enrichRule(rule)
)
export let rulesFr = rawRules.map(rule => enrichRule(rule))

export let findParentDependency = (rules, rule) => {
	// A parent dependency means that one of a rule's parents is not just a namespace holder, it is a boolean question. E.g. is it a fixed-term contract, yes / no
	// When it is resolved to false, then the whole branch under it is disactivated (non applicable)
	// It lets those children omit obvious and repetitive parent applicability tests
	let parentDependencies = ruleParents(rule.dottedName).map(joinName)
	return pipe(
		map(parent => findRuleByDottedName(rules, parent)),
		reject(isNil),
		find(
			//Find the first "calculable" parent
			({ question, format, formule }) => question && !format && !formule //implicitly, the format is boolean
		)
	)(parentDependencies)
}
