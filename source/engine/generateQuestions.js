import { findRuleByDottedName } from './rules'
import React from 'react'
import Explicable from '../components/conversation/Explicable'
import R from 'ramda'
import Question from '../components/conversation/Question'
import Input from '../components/conversation/Input'
import {euro, months} from '../components/conversation/formValueTypes'

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
		<Explicable label={question || name} name={name} lightBackground={true} />
	),
	title: titre || name,
	subquestion,

	// Legacy properties :

	visible: true,
	// helpText: 'Voila un peu d\'aide poto'
})

let isVariant = R.path(['formule', 'une possibilité'])

let buildVariantTree = relevantPaths => path => {
	let rec = path => {
		let node = findRuleByDottedName(path),
			variants = isVariant(node),
			shouldBeExpanded = variants && variants.find( v => relevantPaths.find(rp => R.contains(path + ' . ' + v)(rp) ))

		return Object.assign(
			node,
			shouldBeExpanded ?
				{children: variants.map(v => rec(path + ' . ' + v))}
			: null
		)
	}
	return rec(path)
}

export let generateGridQuestions = R.pipe(
	R.toPairs,
	R.map( ([variantRoot, relevantVariants]) =>
		({
			...constructStepMeta(findRuleByDottedName(variantRoot)),
			component: Question,
			choices: buildVariantTree(relevantVariants)(variantRoot),
			objectives: []
		})
	),

	// R.map( R.pipe(
	// 	R.flatten,
	// 	R.map(findRuleByDottedName),
	// 	([variant, ...variants]) =>
	// 		Object.assign(
	// 			constructStepMeta(variant),
	// 			//TODO reintroduce langue au chat !
	// 			{
	// 				component: Question,
	// 				choices: variants,
	// 			},
	// 			{objectives: []}
				//TODO reintroduce objectives
				// {
				// 	objectives: R.pipe(
				// 		R.chain(v => missingVariables[variant.dottedName + ' . ' + v]),
				// 		R.uniq()
				// 	)(variant['une possibilité'])
				// }
)
export let generateSimpleQuestions = R.pipe(
	R.values, //TODO exploiter ici les groupes de questions de type 'record' (R.keys): elles pourraient potentiellement êtres regroupées visuellement dans le formulaire
	R.unnest,
	R.map(dottedName => {
		let rule = findRuleByDottedName(dottedName)
		if (rule == null) console.log(dottedName)
		return Object.assign(
			constructStepMeta(rule),
			rule.format == 'nombre positif' || rule.format == 'période'
				? {
					component: Input,
					valueType: rule.format == 'nombre positif' ? euro : months,
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
				objectives: [] //missingVariables[dottedName],
			}
		)
	})
)


/*

// Pas de groupe trouvé : ce sont des variables individuelles
[R.isNil, () => variables.map(dottedName => {
	let rule = findRuleByDottedName(dottedName)
	return Object.assign(constructStepMeta(rule),
		rule.format == 'nombre positif' ||
		rule.format == 'période' ?
		{
			component: Input,
			valueType: rule.format == 'nombre positif' ? euro : months,
			attributes: {
				inputMode: 'numeric',
				placeholder: 'votre réponse'
			},
			suggestions: rule.suggestions
		} : {
			component: Question,
			choices: [
				{value: 'non', label: 'Non'},
				{value: 'oui', label: 'Oui'}
			]
		},
		{
			objectives: missingVariables[dottedName]
		}
	)})],

	*/
