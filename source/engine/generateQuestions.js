import React from 'react'
import R from 'ramda'

import Explicable from 'Components/conversation/Explicable'
import Question from 'Components/conversation/Question'
import Input from 'Components/conversation/Input'
import formValueTypes from 'Components/conversation/formValueTypes'

import {analyseSituation, evaluateNode} from './traverse'
import {formValueSelector} from 'redux-form'
import {rules, findRuleByDottedName, findVariantsAndRecords} from './rules'




let situationGate = state =>
	name => formValueSelector('conversation')(state, name)


export let analyse = rootVariable => R.pipe(
	situationGate,
	// une liste des objectifs de la simulation (des 'rules' aussi nommées 'variables')
	analyseSituation(rules, rootVariable)
)



/*
	COLLECTE DES VARIABLES MANQUANTES
	*********************************
	on collecte les variables manquantes : celles qui sont nécessaires pour
	remplir les objectifs de la simulation (calculer des cotisations) mais qui n'ont pas
	encore été renseignées

	TODO perf : peut-on le faire en même temps que l'on traverse l'AST ?
	Oui sûrement, cette liste se complète en remontant l'arbre. En fait, on le fait déjà pour nodeValue,
	et quand nodeValue vaut null, c'est qu'il y a des missingVariables ! Il suffit donc de remplacer les
	null par un tableau, et d'ailleurs utiliser des fonction d'aide pour mutualiser ces tests.

	missingVariables: {variable: [objectives]}
 */

// On peut travailler sur une somme, les objectifs sont alors les variables de cette somme.
// Ou sur une variable unique ayant une formule, elle est elle-même le seul objectif
export let getObjectives = (situationGate, root, parsedRules) => {
	let formuleType = R.path(["formule", "explanation", "name"])(
		root
	)

	let targets = formuleType == "somme"
		? R.pluck(
				"dottedName",
				R.path(["formule", "explanation", "explanation"])(root)
			)
		: formuleType ? [root] : null,
		names = targets ? R.reject(R.isNil)(targets) : []

	let findAndEvaluate = name => evaluateNode(situationGate,parsedRules,findRuleByDottedName(parsedRules,name))
	return R.map(findAndEvaluate,names)
}

let collectNodeMissingVariables = (root) => {
	return root.collectMissing ? root.collectMissing(root) : []
}

export let collectMissingVariables = (groupMethod='groupByMissingVariable') => (situationGate, {root, parsedRules}) => {
	return R.pipe(
		R.curry(getObjectives)(situationGate),
		R.chain( v =>
			R.pipe(
				collectNodeMissingVariables,
				R.flatten,
				R.map(mv => [v.dottedName, mv])
			)(v)
		),
		//groupBy missing variable but remove mv from value, it's now in the key
		R.groupBy(groupMethod == 'groupByMissingVariable' ? R.last : R.head),
		R.map(R.map(groupMethod == 'groupByMissingVariable' ? R.head : R.last))
		// below is a hand implementation of above... function composition can be nice sometimes :')
		// R.reduce( (memo, [mv, dependencyOf]) => ({...memo, [mv]: [...(memo[mv] || []), dependencyOf] }), {})
	)(root, parsedRules)
}

export let buildNextSteps = (situationGate, flatRules, analysedSituation) => {
	let missingVariables = collectMissingVariables('groupByMissingVariable')(
		situationGate, analysedSituation
	)

	/*
		Parmi les variables manquantes, certaines sont citées dans une règle de type 'une possibilité'.
		**On appelle ça des groupes de type 'variante'.**
		Il est alors plus intéressant de demander leur valeur dans un grille de possibilité plutôt que de façon indépendante.

		Par exemple, au lieu de :

		q1: "Pensez vous prolonger le CDD en CDI",
		r1: Oui | Non
		q2: "Pensez-vous qu'une rupture pour faute grave est susceptible d'arriver"
		r2: Oui | Non

		on préfère :

		q: "Pensez-vous être confronté à l'un de ces événements ?"
		r: Prolongation du CDD en CDI | Rupture pour faute grave.

		Ceci est possible car ce sont tous les deux des événements et qu'ils sont incompatibles entre eux.
		Pour l'instant, cela n'est possible que si les variables ont comme parent (ou grand-parent),
		au sens de leur espace de nom, une règle de type 'une possibilité'.
		#TODO pouvoir faire des variantes sans cette contrainte d'espace de nom

		D'autres variables pourront être regroupées aussi, car elles partagent un parent, mais sans fusionner leurs questions dans l'interface. Ce sont des **groupes de type _record_ **
	*/

	// This is effectively a missingVariables.groupBy(questionRequired)
	// but "questionRequired" does not have a clear specification
	// we could look up "what formula is this variable mentioned in, and does it have a question attached"
	// the problem is that we parse rules "bottom up", we would therefore need to:
	// - parse rules top-down, i.e. analysedSituations = map(treatRuleRoot, rules)
	// (might be a problem later on in terms of "big" rulesets, but not now)
	// - decorate each rule with "mentions / depends on the following rules"
	// - provide a "is mentioned by" query

	return R.pipe(
		R.keys,
		R.curry(findVariantsAndRecords)(flatRules),
		// on va maintenant construire la liste des composants React qui afficheront les questions à l'utilisateur pour que l'on obtienne les variables manquantes
		R.evolve({
			variantGroups: generateGridQuestions(flatRules, missingVariables),
			recordGroups: generateSimpleQuestions(flatRules, missingVariables),
		}),
		R.values,
		R.unnest,
		R.sort((a,b) => b.impact - a.impact),
	)(missingVariables)
}



export let constructStepMeta = ({
	titre,
	question,
	subquestion,
	dottedName,
	name,
}) => ({
	// name: dottedName.split(' . ').join('.'),
	name: dottedName,
	// question: question || name,
	question: (
		<Explicable label={question || name} dottedName={dottedName} lightBackground={true} />
	),
	title: titre || name,
	subquestion,

	// Legacy properties :

	visible: true,
	// helpText: 'Voila un peu d\'aide poto'
})

let isVariant = R.path(['formule', 'une possibilité'])

let buildVariantTree = (allRules, relevantPaths) => path => {
	let rec = path => {
		let node = findRuleByDottedName(allRules, path),
			variant = isVariant(node),
			variants = variant && R.unless(R.is(Array), R.prop('possibilités'))(variant),
			shouldBeExpanded = variant && variants.find( v => relevantPaths.find(rp => R.contains(path + ' . ' + v)(rp) )),
			canGiveUp = variant && !variant['choix obligatoire']

		return Object.assign(
			node,
			shouldBeExpanded ?
				{	canGiveUp,
					children: variants.map(v => rec(path + ' . ' + v))
				}
			: null
		)
	}
	return rec(path)
}

export let generateGridQuestions = (allRules, missingVariables) => R.pipe(
	R.toPairs,
	R.map( ([variantRoot, relevantVariants]) => {
			return ({
				...constructStepMeta(findRuleByDottedName(allRules, variantRoot)),
				component: Question,
				choices: buildVariantTree(allRules, relevantVariants)(variantRoot),
				objectives:  R.pipe(
					R.chain(v => missingVariables[v]),
					R.uniq()
				)(relevantVariants),
				// Mesure de l'impact de cette variable : combien de fois elle est citée par une règle
				impact: relevantVariants.reduce((count, next) => count + missingVariables[next].length, 0)
			})
		}
	)
)

export let generateSimpleQuestions = (allRules, missingVariables) => R.pipe(
	R.values, //TODO exploiter ici les groupes de questions de type 'record' (R.keys): elles pourraient potentiellement êtres regroupées visuellement dans le formulaire
	R.unnest,
	R.map(dottedName => {
		let rule = findRuleByDottedName(allRules, dottedName)
		if (rule == null) console.log(dottedName)
		return Object.assign(
			constructStepMeta(rule),
			rule.format != null
				? {
					component: Input,
					valueType: formValueTypes[rule.format],
					attributes: {
						inputMode: 'numeric',
						placeholder: 'votre réponse',
					},
					suggestions: rule.suggestions,
				}
				: {
					component: Question,
					choices: [
							{ value: 'non', label: 'Non' },
							{ value: 'oui', label: 'Oui' },
					],
				},
			{
				objectives: missingVariables[dottedName],
				impact: missingVariables[dottedName].length
			}
		)
	})
)
