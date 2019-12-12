import Input from 'Components/conversation/Input'
import Question from 'Components/conversation/Question'
import SelectGéo from 'Components/conversation/select/SelectGéo'
import SelectAtmp from 'Components/conversation/select/SelectTauxRisque'
import { serialiseUnit } from 'Engine/units'
import { is, pick, prop, unless } from 'ramda'
import React from 'react'
import { findRuleByDottedName, queryRule } from './rules'

// This function takes the unknown rule and finds which React component should be displayed to get a user input through successive if statements
// That's not great, but we won't invest more time until we have more diverse input components and a better type system.

// eslint-disable-next-line react/display-name
export default rules => dottedName => {
	let rule = findRuleByDottedName(rules, dottedName)

	let commonProps = {
		key: dottedName,
		fieldName: dottedName,
		...pick(['dottedName', 'title', 'question', 'defaultValue'], rule)
	}

	if (getVariant(rule))
		return (
			<Question
				{...{
					...commonProps,
					choices: buildVariantTree(rules, dottedName)
				}}
			/>
		)
	if (rule.API && rule.API === 'géo')
		return <SelectGéo {...{ ...commonProps }} />
	if (rule.API) throw new Error("Le seul API implémenté est l'API géo")

	if (rule.unit == null)
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
					suggestions: rule.suggestions
				}}
			/>
		)

	// Now the numeric input case

	return (
		<Input
			{...{
				...commonProps,
				unit: serialiseUnit(rule.unit || rule.defaultUnit),
				suggestions: rule.suggestions
			}}
		/>
	)
}

let getVariant = rule => queryRule(rule)('formule . une possibilité')

let buildVariantTree = (allRules, path) => {
	let rec = path => {
		let node = findRuleByDottedName(allRules, path)
		if (!node) throw new Error(`La règle ${path} est introuvable`)
		let variant = getVariant(node),
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
