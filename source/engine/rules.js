import { parseUnit } from 'Engine/units'
import {
	assoc,
	chain,
	dropLast,
	filter,
	fromPairs,
	has,
	is,
	isNil,
	join,
	last,
	map,
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
	when,
} from 'ramda'
// TODO - should be in UI, not engine
import { capitalise0, coerceArray } from '../utils'
import { syntaxError, warning } from './error'
import possibleVariableTypes from './possibleVariableTypes.yaml'

/***********************************
Functions working on one rule */

export let enrichRule = (rule) => {
	try {
		const dottedName = rule.dottedName || rule.nom
		const name = nameLeaf(dottedName)
		let unit = rule.unité && parseUnit(rule.unité)
		let defaultUnit =
			rule['unité par défaut'] && parseUnit(rule['unité par défaut'])

		if (defaultUnit && unit) {
			warning(
				dottedName,
				'Le paramètre `unité` est plus contraignant que `unité par défaut`.',
				'Si vous souhaitez que la valeur de votre variable soit toujours la même unité, gardez `unité`'
			)
		}

		return {
			...rule,
			dottedName,
			name,
			type: possibleVariableTypes.find((t) => has(t, rule) || rule.type === t),
			title: capitalise0(rule['titre'] || name),
			defaultValue: rule['par défaut'],
			examples: rule['exemples'],
			icons: rule['icônes'],
			summary: rule['résumé'],
			inputEstimation: rule['aide'],
			unit,
			defaultUnit,
		}
	} catch (e) {
		syntaxError(
			rule.dottedName || rule.nom,
			'Problème dans la lecture des champs de la règle',
			e
		)
	}
}

// les variables dans les tests peuvent être exprimées relativement à l'espace de nom de la règle,
// comme dans sa formule
export let disambiguateExampleSituation = (rules, rule) =>
	pipe(
		toPairs,
		map(([k, v]) => [disambiguateRuleReference(rules, rule, k), v]),
		fromPairs
	)

export let hasKnownRuleType = (rule) => rule && enrichRule(rule).type

export let splitName = split(' . '),
	joinName = join(' . ')

export let parentName = pipe(splitName, dropLast(1), joinName)
export let nameLeaf = pipe(splitName, last)

export let encodeRuleName = (name) =>
	encodeURI(
		name
			.replace(/\s\.\s/g, '/')
			.replace(/-/g, '\u2011') // replace with a insecable tiret to differenciate from space
			.replace(/\s/g, '-')
	)
export let decodeRuleName = (name) =>
	decodeURI(
		name
			.replace(/\//g, ' . ')
			.replace(/-/g, ' ')
			.replace(/\u2011/g, '-')
	)

export let ruleParents = (dottedName) => {
	let fragments = splitName(dottedName) // dottedName ex. [CDD . événements . rupture]
	return range(1, fragments.length)
		.map((nbEl) => take(nbEl)(fragments))
		.reverse() //  -> [ [CDD . événements . rupture], [CDD . événements], [CDD] ]
}
/* In a formula, variables can be cited without referring to them absolutely : namespaces can be omitted to enhance the readability. This function resolves this ambiguity.
 * */
export let disambiguateRuleReference = (
	allRules,
	{ dottedName, name },
	partialName
) => {
	let pathPossibilities = [
			splitName(dottedName), // the rule's own namespace
			...ruleParents(dottedName), // the parent namespaces
			[], // the top level namespace
		],
		found = reduce(
			(res, path) => {
				let dottedNameToCheck = [...path, partialName].join(' . ')
				return when(
					is(Object),
					reduced
				)(findRuleByDottedName(allRules, dottedNameToCheck))
			},
			null,
			pathPossibilities
		)

	if (found?.dottedName) {
		return found.dottedName
	}

	throw new Error(
		`OUUUUPS la référence '${partialName}' dans la règle '${name}' est introuvable dans la base`
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
	(Array.isArray(allRules) ? allRules : Object.values(allRules)).find(
		({ name }) => name === query
	)

export let findRulesByName = (allRules, query) =>
	(Array.isArray(allRules) ? allRules : Object.values(allRules)).filter(
		({ name }) => name === query
	)

export let findRuleByDottedName = (allRules, dottedName) =>
	Array.isArray(allRules)
		? allRules.find((rule) => rule.dottedName == dottedName)
		: allRules[dottedName]

export let findRule = (rules, nameOrDottedName) =>
	nameOrDottedName.includes(' . ')
		? findRuleByDottedName(rules, nameOrDottedName)
		: findRuleByName(rules, nameOrDottedName)

export let findRuleByNamespace = (allRules, ns) =>
	allRules.filter((rule) => parentName(rule.dottedName) === ns)

/*********************************
 Autres */

export let queryRule = (rule) => (query) => path(query.split(' . '))(rule)

export let nestedSituationToPathMap = (situation) => {
	if (situation == undefined) return {}
	let rec = (o, currentPath) =>
		typeof o === 'object'
			? chain(([k, v]) => rec(v, [...currentPath, trim(k)]), toPairs(o))
			: [[currentPath.join(' . '), o + '']]

	return fromPairs(rec(situation, []))
}

/* Traduction */

export let translateAll = (translations, flatRules) => {
	let translationsOf = (rule) => translations[rule.dottedName],
		translateProp = (lang, translation) => (rule, prop) => {
			let propTrans = translation[prop + '.' + lang]
			if (prop === 'suggestions' && propTrans)
				return assoc(
					'suggestions',
					pipe(
						toPairs,
						map(([key, translatedKey]) => [
							translatedKey,
							rule.suggestions[key],
						]),
						fromPairs
					)(propTrans),
					rule
				)
			return propTrans ? assoc(prop, propTrans, rule) : rule
		},
		translateRule = (lang, translations, props) => (rule) => {
			let ruleTrans = translationsOf(rule)
			return ruleTrans
				? reduce(translateProp(lang, ruleTrans), rule, props)
				: rule
		}

	let targets = [
		'titre',
		'description',
		'question',
		'résumé',
		'suggestions',
		'contrôles',
	]

	return map(translateRule('en', translations, targets), flatRules)
}

export let findParentDependencies = (rules, rule) => {
	// A parent dependency means that one of a rule's parents is not just a namespace holder, it is a boolean question. E.g. is it a fixed-term contract, yes / no
	// When it is resolved to false, then the whole branch under it is disactivated (non applicable)
	// It lets those children omit obvious and repetitive parent applicability tests
	let parentDependencies = ruleParents(rule.dottedName).map(joinName)
	return pipe(
		map((parent) => findRuleByDottedName(rules, parent)),
		reject(isNil),
		filter(
			//Find the first "calculable" parent
			({ question, unit, formule }) =>
				(question && !unit && !formule) ||
				(question && formule?.['une possibilité'] !== undefined) ||
				(typeof formule === 'string' && formule.includes(' = ')) ||
				formule === 'oui' ||
				formule === 'non'
		)
	)(parentDependencies)
}

export let getRuleFromAnalysis = (analysis) => (dottedName) => {
	if (!analysis) {
		throw new Error("[getRuleFromAnalysis] The analysis can't be nil !")
	}

	let rule = coerceArray(analysis) // In some simulations, there are multiple "branches" : the analysis is run with e.g. 3 different input situations
		.map(
			(analysis) =>
				analysis.cache[dottedName]?.explanation || // the cache stores a reference to a variable, the variable is contained in the 'explanation' attribute
				analysis.targets.find(propEq('dottedName', dottedName))
		)
		.filter(Boolean)[0]
	if (process.env.NODE_ENV !== 'production' && !rule) {
		console.warn(`[getRuleFromAnalysis] Unable to find the rule ${dottedName}`)
	}

	return rule
}
