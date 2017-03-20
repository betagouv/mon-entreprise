// Séparation artificielle, temporaire, entre ces deux types de règles
import rawRules from './load-rules'
import R from 'ramda'
import possibleVariableTypes from './possibleVariableTypes.yaml'
import marked from 'marked'


let customMarked = new marked.Renderer()
customMarked.link = ( href, title, text ) =>
	`<a target="_blank" href="${ href }" title="${ title }">${ text }</a>`
marked.setOptions({
	renderer: customMarked
})

/***********************************
 Méthodes agissant sur une règle */

// Enrichissement de la règle avec des informations évidentes pour un lecteur humain
export let enrichRule = rule => {
	let
		type = possibleVariableTypes.find(t => rule[t]),
		name = rule[type],
		dottedName = rule.attache && [
			rule.attache,
			name
		].join(' . '),
		subquestionMarkdown = rule['sous-question'],
		subquestion = subquestionMarkdown && marked(subquestionMarkdown)

	return {...rule, type, name, dottedName, subquestion}
}

export let hasKnownRuleType = rule => rule && enrichRule(rule).type

let
	splitName = R.split(' . '),
	joinName = R.join(' . ')

export let parentName = R.pipe(
	splitName,
	R.dropLast(1),
	joinName
)
export let nameLeaf = R.pipe(
	splitName,
	R.last
)

/* Les variables peuvent être exprimées dans une règle relativement à son contexte, son 'attache', pour une plus grande lisibilité. Cette fonction résoud cette ambiguité.
*/
export let completeRuleName = ({attache, name}, partialName) => {
	let
		fragments = attache.split(' . '),
		pathPossibilities = R.pipe(
			R.length,
			R.inc,
			R.range(1),
			R.map(R.take(R.__, fragments)),
			R.reverse
		)(fragments),

		found = R.reduce((res, path) =>
			R.when(
				R.is(Object), R.reduced
			)(findRuleByDottedName([...path, partialName].join(' . ')))
		, null, pathPossibilities)

	return found && found.dottedName || do {throw `OUUUUPS la référence ${partialName} dans la règle : ${name} est introuvable dans la base`}
}


// On enrichit la base de règles avec des propriétés dérivées de celles du YAML
export let rules = rawRules.map(enrichRule)


/****************************************
 Méthodes de recherche d'une règle */

export let findRuleByName = search =>
	rules
		.map(enrichRule)
		.find( ({name}) =>
			name === search
		)

export let searchRules = searchInput =>
	rules
		.filter( rule =>
			rule && hasKnownRuleType(rule) &&
			JSON.stringify(rule).toLowerCase().indexOf(searchInput) > -1)
		.map(enrichRule)

export let findRuleByDottedName = dottedName => // console.log('dottedName', rules,  dottedName) ||
	rules.find(rule => rule.dottedName == dottedName)

export let findGroup = R.pipe(
	findRuleByDottedName,
	found => found && found['une possibilité'] && found,
	// Is there a way to express this more litterally in ramda ?
	// R.unless(
	// 	R.isNil,
	// 	R.when(
	// 		R.has('une possibilité'),
	// 		R.identity
	// 	)
	// )
)

/*********************************
Autres */

let collectNodeMissingVariables = target => (root, source=root, results=[]) => {
	if (
    source.nodeValue != null  ||
    source.shortCircuit && source.shortCircuit(root)
  ) return []

	if (source[target]) {
		results.push(source[target])
	}

	for (var prop in source) {
		if (R.is(Object)(source[prop]))
			collectNodeMissingVariables(target)(root, source[prop], results)
	}

	return results
}


export let collectMissingVariables = (groupMethod='groupByMissingVariable', analysedSituation) =>
	R.pipe(
		R.unless(R.is(Array), R.of),
		R.chain( v =>
			R.pipe(
				collectNodeMissingVariables('missingVariables'),
				R.flatten,
				R.map(mv => [v.variableName, mv])
			)(v)
		),
		//groupBy missing variable but remove mv from value, it's now in the key
		R.groupBy(groupMethod == 'groupByMissingVariable' ? R.last : R.head),
		R.map(R.map(groupMethod == 'groupByMissingVariable' ? R.head : R.last))
		// below is a hand implementation of above... function composition can be nice sometimes :')
		// R.reduce( (memo, [mv, dependencyOf]) => ({...memo, [mv]: [...(memo[mv] || []), dependencyOf] }), {})
	)(analysedSituation)
