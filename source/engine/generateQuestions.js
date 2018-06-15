import {
	flatten,
	keys,
	reduce,
	mergeWith,
	add,
	values,
	sortWith,
	descend,
	fromPairs,
	countBy,
	toPairs,
	pair,
	map,
	head,
	unless,
	is,
	prop,
	pick,
	identity
} from 'ramda'
import React from 'react'
import Question from 'Components/conversation/Question'
import Input from 'Components/conversation/Input'
import Select from 'Components/conversation/select/Select'
import SelectAtmp from 'Components/conversation/select/SelectTauxRisque'
import formValueTypes from 'Components/conversation/formValueTypes'

import { findRuleByDottedName, queryRule } from './rules'

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

export let collectMissingVariablesByTarget = targets =>
	fromPairs(targets.map(target => [target.dottedName, target.missingVariables]))

export let getNextSteps = missingVariablesByTarget => {
	let byCount = ([, [count]]) => count
	let byScore = ([, [, score]]) => score

	let missingByTotalScore = reduce(
		mergeWith(add),
		{},
		values(missingVariablesByTarget)
	)

	let innerKeys = flatten(map(keys, values(missingVariablesByTarget))),
		missingByTargetsAdvanced = countBy(identity, innerKeys)

	let missingByCompound = mergeWith(
			pair,
			missingByTargetsAdvanced,
			missingByTotalScore
		),
		pairs = toPairs(missingByCompound),
		sortedPairs = sortWith([descend(byCount), descend(byScore)], pairs)

	return map(head, sortedPairs)
}

export let collectMissingVariables = targets =>
	getNextSteps(collectMissingVariablesByTarget(targets))

let isVariant = rule => queryRule(rule.raw)('formule . une possibilité')

let buildVariantTree = (allRules, path) => {
	let rec = path => {
		let node = findRuleByDottedName(allRules, path),
			variant = isVariant(node),
			variants = variant && unless(is(Array), prop('possibilités'))(variant),
			shouldBeExpanded = variant && true, //variants.find( v => relevantPaths.find(rp => contains(path + ' . ' + v)(rp) )),
			canGiveUp = variant && !variant['choix obligatoire']

		return Object.assign(
			node,
			shouldBeExpanded
				? {
						canGiveUp,
						children: variants.map(v => rec(path + ' . ' + v))
				  }
				: null
		)
	}
	return rec(path)
}

// This function takes the unknown rule and finds which React component should be displayed to get a user input through successive if statements
// That's not great, but we won't invest more time until we have more diverse input components and a better type system.
export let getInputComponent = rules => dottedName => {
	let rule = findRuleByDottedName(rules, dottedName)

	let commonProps = {
		key: dottedName,
		fieldName: dottedName,
		...pick(['dottedName', 'title', 'question', 'defaultValue'], rule)
	}

	if (isVariant(rule))
		return (
			<Question
				{...{
					...commonProps,
					choices: buildVariantTree(rules, dottedName)
				}}
			/>
		)

	if (rule.format == null)
		return (
			<Question
				{...{
					...commonProps,
					choices: [
						{ value: 'non', label: 'Non' },
						{ value: 'oui', label: 'Oui' }
					]
				}}
			/>
		)

	if (rule.suggestions == 'atmp-2017')
		return (
			<SelectAtmp
				{...{
					...commonProps,
					valueType: formValueTypes[rule.format],
					suggestions: rule.suggestions
				}}
			/>
		)

	if (typeof rule.suggestions == 'string')
		return (
			<Select
				{...{
					...commonProps,
					valueType: formValueTypes[rule.format],
					suggestions: rule.suggestions
				}}
			/>
		)

	// Now the numeric input case

	return (
		<Input
			{...{
				...commonProps,
				valueType: formValueTypes[rule.format],
				suggestions: rule.suggestions
			}}
		/>
	)
}
