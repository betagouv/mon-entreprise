import {
	flatten,
	mergeAll,
	pluck,
	groupBy,
	toPairs,
	sort,
	map,
	length,
	descend,
	head,
	unless,
	is,
	prop,
	path,
	reject,
	identity
} from 'ramda'

import Question from 'Components/conversation/Question'
import Input from 'Components/conversation/Input'
import Select from 'Components/conversation/select/Select'
import SelectAtmp from 'Components/conversation/select/SelectTauxRisque'
import formValueTypes from 'Components/conversation/formValueTypes'

import { findRuleByDottedName, disambiguateRuleReference } from './rules'

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

export let collectMissingVariables = targets => mergeAll(pluck('missingVariables', targets))

export let getNextSteps = (situationGate, analysis) => {
	let impact = ([, count]) => count

	let missingVariables = collectMissingVariables(analysis.targets),
		pairs = toPairs(missingVariables),
		sortedPairs = sort(descend(impact), pairs)
	return map(head, sortedPairs)
}

let isVariant = path(['formule', 'une possibilité'])

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

let buildPossibleInversion = (rule, flatRules, targetNames) => {
	let ruleInversions = path(['formule', 'inversion', 'avec'])(rule)
	if (!ruleInversions) return null
	let inversionObjects = ruleInversions.map(i =>
			findRuleByDottedName(
				flatRules,
				disambiguateRuleReference(flatRules, rule, i)
			)
		),
		inversions = reject(({ name }) => targetNames.includes(name))(
			[rule].concat(inversionObjects)
		)

	return {
		inversions,
		question: rule.formule.inversion.question
	}
}

export let getInputComponent = ({ unfolded }) => (
	rules,
	targetNames,
	inputInversions
) => dottedName => {
	let rule = findRuleByDottedName(rules, dottedName)

	let fieldName =
			(inputInversions && path(dottedName.split('.'), inputInversions)) ||
			dottedName,
		fieldTitle = findRuleByDottedName(rules, fieldName).title

	let commonProps = {
		unfolded,
		fieldName,
		title: rule.title
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

	return (
		<Input
			{...{
				...commonProps,
				valueType: formValueTypes[rule.format],
				suggestions: rule.suggestions,
				inversion: buildPossibleInversion(rule, rules, targetNames),
				fieldTitle,
				inverted: dottedName !== fieldName
			}}
		/>
	)
}
