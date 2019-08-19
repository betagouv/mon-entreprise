import { evaluateControls } from 'Engine/controls';
import parseRule from 'Engine/parseRule';
import { chain, path } from 'ramda';
import { evaluateNode } from './evaluation';
import { parseReference } from './parseReference';
import { findRule, findRuleByDottedName, disambiguateRuleReference } from './rules';

/*
 Dans ce fichier, les règles YAML sont parsées.
 Elles expriment un langage orienté expression, les expressions étant
 - préfixes quand elles sont des 'mécanismes' (des mot-clefs représentant des calculs courants dans la loi)
 - infixes pour les feuilles : des tests d'égalité, d'inclusion, des comparaisons sur des variables ou tout simplement la  variable elle-même, ou une opération effectuée sur la variable

*/

/*
-> Notre règle est naturellement un AST (car notation préfixe dans le YAML)
-> préliminaire : les expression infixes devront être parsées,
par exemple ainsi : https://github.com/Engelberg/instaparse#transforming-the-tree
-> Notre règle entière est un AST, qu'il faut maintenant traiter :


- faire le calcul (déterminer les valeurs de chaque noeud)
- trouver les branches complètes pour déterminer les autres branches courtcircuitées
	- ex. rule.formule est courtcircuitée si rule.non applicable est vrai
	- les feuilles de 'une de ces conditions' sont courtcircuitées si l'une d'elle est vraie
	- les feuilles de "toutes ces conditions" sont courtcircuitées si l'une d'elle est fausse
	- ...
(- bonus : utiliser ces informations pour l'ordre de priorité des variables inconnues)

- si une branche est incomplète et qu'elle est de type numérique, déterminer les bornes si c'est possible.
	Ex. - pour une multiplication, si l'assiette est connue mais que l 'applicabilité est inconnue,
				les bornes seront [0, multiplication.value = assiette * taux]
			- si taux = effectif entreprise >= 20 ? 1% : 2% et que l'applicabilité est connue,
				bornes = [assiette * 1%, assiette * 2%]

- transformer l'arbre en JSX pour afficher le calcul *et son état en prenant en compte les variables renseignées et calculées* de façon sympathique dans un butineur Web tel que Mozilla Firefox.


- surement plein d'autres applications...

*/

export let parseAll = flatRules => {
	/* First we parse each rule one by one. When a mechanism is encountered, it is recursively parsed. When a reference to a variable is encountered, a 'variable' node is created, we don't parse variables recursively. */

	let parsedRules = {}

	/* A rule `A` can disable a rule `B` using the rule `rend non applicable: B` in the definition of `A`.
	We need to map these exonerations to be able to retreive them from `B` */
	let nonApplicableMapping = {}
	flatRules.forEach(rule => {
		const parsed = parseRule(flatRules, rule, parsedRules)
		if (parsed['rend non applicable']) {
			nonApplicableMapping[rule.dottedName] = parsed['rend non applicable']
		}
	})

	Object.entries(nonApplicableMapping).forEach(([a, b]) => {
		b.forEach(ruleName => {
			parsedRules[ruleName].isDisabledBy.push(
				parseReference(flatRules, parsedRules[ruleName], parsedRules)({
					fragments: [a]
				})
			)
		})
	})
	/* Then we need to infer units. Since only references to variables have been created, we need to wait for the latter map to complete before starting this job. Consider this example : 
		A = B * C
		B = D / E

		C unité km
		D unité €
		E unité km
	 *
	 * When parsing A's formula, we don't know the unit of B, since only the final nodes have units (it would be too cumbersome to specify a unit to each variable), and B hasn't been parsed yet.
	 *
	 * */

	return parsedRules
}

export let getTargets = (target, rules) => {
	let multiSimulation = path(['simulateur', 'objectifs'])(target)
	let targets = multiSimulation
		? // On a un simulateur qui définit une liste d'objectifs
		  multiSimulation
				.map(n => disambiguateRuleReference(rules, target, n))
				.map(n => findRuleByDottedName(rules, n))
		: // Sinon on est dans le cas d'une simple variable d'objectif
		  [target]

	return targets
}

export let analyseMany = (parsedRules, targetNames) => situationGate => {
	// TODO: we should really make use of namespaces at this level, in particular
	// setRule in Rule.js needs to get smarter and pass dottedName
	let cache = { parseLevel: 0 }

	let parsedTargets = targetNames.map(t => {
			let parsedTarget = findRule(parsedRules, t)
			if (!parsedTarget)
				throw new Error(
					`L'objectif de calcul "${t}" ne semble pas  exister dans la base de règles`
				)
			return parsedTarget
		}),
		targets = chain(pt => getTargets(pt, parsedRules), parsedTargets).map(
			t =>
				cache[t.dottedName] || // This check exists because it is not done in parseRuleRoot's eval, while it is in parseVariable. This should be merged : we should probably call parseVariable here : targetNames could be expressions (hence with filters) TODO
				evaluateNode(cache, situationGate, parsedRules, t)
		)

	let controls = evaluateControls(cache, situationGate, parsedRules)

	return { targets, cache, controls }
}

export let analyse = (parsedRules, target) => {
	return analyseMany(parsedRules, [target])
}
