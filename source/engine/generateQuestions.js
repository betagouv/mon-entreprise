import React from 'react'
import Explicable from '../components/conversation/Explicable'
import R from 'ramda'
import Question from '../components/conversation/Question'
import Input from '../components/conversation/Input'
import formValueTypes from '../components/conversation/formValueTypes'
import {analyseSituation} from './traverse'
import {formValueSelector} from 'redux-form'
import { STEP_ACTION, START_CONVERSATION} from '../actions'
import {rules, findRuleByDottedName, collectMissingVariables, findVariantsAndRecords} from './rules'


export let reduceSteps = (state, action) => {

	if (![START_CONVERSATION, STEP_ACTION].includes(action.type))
		return state

	let rootVariable = action.type == START_CONVERSATION ? action.rootVariable : state.analysedSituation.name

	let returnObject = {
		...state,
		analysedSituation: analyse(rootVariable)(state)
	}

	if (action.type == START_CONVERSATION) {
		return {
			...returnObject,
			foldedSteps: state.foldedSteps || [],
			unfoldedSteps: buildNextSteps(rules, returnObject.analysedSituation)
		}
	}
	if (action.type == STEP_ACTION && action.name == 'fold') {
		return {
			...returnObject,
			foldedSteps: [...state.foldedSteps, R.head(state.unfoldedSteps)],
			unfoldedSteps: buildNextSteps(rules, returnObject.analysedSituation)
		}
	}
	if (action.type == STEP_ACTION && action.name == 'unfold') {
		let stepFinder = R.propEq('name', action.step),
			foldedSteps = R.reject(stepFinder)(state.foldedSteps)
		if (foldedSteps.length != state.foldedSteps.length - 1)
			throw 'Problème lors du dépliement d\'une réponse'

		return {
			...returnObject,
			foldedSteps,
			unfoldedSteps: [R.find(stepFinder)(state.foldedSteps)]
		}
	}
}


let situationGate = state =>
	name => formValueSelector('conversation')(state, name)


let analyse = rootVariable => R.pipe(
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
export let buildNextSteps = (allRules, analysedSituation) => {
	let missingVariables = collectMissingVariables('groupByMissingVariable')(
		analysedSituation
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

	// Ramda has trouble automatically currying this construction
	let findVAR = (memo,name) => findVariantsAndRecords(allRules, memo, name, null)

	return R.pipe(
		R.keys,
		R.reduce(findVAR, {variantGroups: {}, recordGroups: {}}),
		// on va maintenant construire la liste des composants React qui afficheront les questions à l'utilisateur pour que l'on obtienne les variables manquantes
		R.evolve({
			variantGroups: generateGridQuestions(allRules, missingVariables),
			recordGroups: generateSimpleQuestions(allRules, missingVariables),
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
