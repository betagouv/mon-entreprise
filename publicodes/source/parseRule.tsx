import { evolve, map } from 'ramda'
import React from 'react'
import { Trans } from 'react-i18next'
import { Mecanism } from './components/mecanisms/common'
import { RuleLinkWithContext } from './components/RuleLink'
import { compilationError, warning } from './error'
import evaluate from './evaluateRule'
import { evaluateNode, makeJsx, mergeAllMissing } from './evaluation'
import { parse } from './parse'
import {
	disambiguateRuleReference,
	findParentDependencies,
	nameLeaf
} from './ruleUtils'
import { ParsedRule, Rule, Rules } from './types'
import {
	areUnitConvertible,
	parseUnit,
	serializeUnit,
	simplifyUnit
} from './units'
import { capitalise0, coerceArray } from './utils'

export default function<Names extends string>(
	rules: Rules<Names>,
	dottedName,
	parsedRules
): ParsedRule<Names> {
	if (parsedRules[dottedName]) return parsedRules[dottedName]

	parsedRules[dottedName] = 'being parsed'
	/*
		The parseRule function will traverse the tree of the `rule` and produce an
		AST, an object containing other objects containing other objects... Some of
		the attributes of the rule are dynamic, they need to be parsed. It is the
		case of  `non applicable si`, `applicable si`, `formule`. These attributes'
		values themselves may have  mechanism properties (e. g. `barème`) or inline
		expressions (e. g. `maVariable + 3`). These mechanisms or variables are in
		turn traversed by `parse()`. During this processing, 'evaluate' and'jsx'
		functions are attached to the objects of the AST. They will be evaluated
		during the evaluation phase, called "analyse".
	*/

	const parentDependencies = findParentDependencies(rules, dottedName)
	let rawRule = rules[dottedName]
	if (rawRule == null) {
		rawRule = {}
	}
	if (typeof rawRule === 'string') {
		rawRule = {
			formule: rawRule
		}
	}
	rawRule as Rule

	if (
		rawRule['par défaut'] &&
		rawRule['formule'] &&
		!rawRule.formule['une possibilité']
	) {
		throw new warning(
			dottedName,
			'Une règle ne peut pas avoir à la fois une formule ET une valeur par défaut.'
		)
	}

	const name = nameLeaf(dottedName)
	const unit = rawRule.unité != null ? parseUnit(rawRule.unité) : undefined

	const rule = {
		...rawRule,
		rawRule,
		name,
		dottedName,
		type: rawRule.type,
		title: capitalise0(rawRule['titre'] || name),
		examples: rawRule['exemples'],
		icons: rawRule['icônes'],
		summary: rawRule['résumé'],
		unit,
		parentDependencies,
		defaultValue: rawRule['par défaut']
	}

	const parsedRule = evolve({
		// Voilà les attributs d'une règle qui sont aujourd'hui dynamiques, donc à traiter
		// Les métadonnées d'une règle n'en font pas aujourd'hui partie

		// condition d'applicabilité de la règle
		parentDependencies: parents =>
			parents.map(parent => {
				const node = parse(rules, rule, parsedRules)(parent)

				const jsx = ({ nodeValue, explanation }) =>
					nodeValue === null ? (
						<div>Active seulement si {makeJsx(explanation)}</div>
					) : nodeValue === true ? (
						<div>Active car {makeJsx(explanation)}</div>
					) : nodeValue === false ? (
						<div>Non active car {makeJsx(explanation)}</div>
					) : null

				return {
					evaluate: (cache, situation, parsedRules) =>
						node.evaluate(cache, situation, parsedRules, node),
					jsx,
					category: 'ruleProp',
					rulePropType: 'cond',
					name: 'parentDependencies',
					type: 'numeric',
					explanation: node
				}
			}),
		'non applicable si': evolveCond(
			'non applicable si',
			rule,
			rules,
			parsedRules
		),
		'applicable si': evolveCond('applicable si', rule, rules, parsedRules),
		'rend non applicable': nonApplicableRules =>
			coerceArray(nonApplicableRules).map(referenceName => {
				return disambiguateRuleReference(rules, dottedName, referenceName)
			}),
		remplace: evolveReplacement(rules, rule, parsedRules),
		defaultValue: value =>
			typeof value === 'string' || typeof value === 'number'
				? parse(rules, rule, parsedRules)(value)
				: // TODO : An "object" default value is only used in the
				// "synchronisation" mecanism. This should be refactored to not use the
				// attribute "defaultValue"
				typeof value === 'object'
				? { ...value, evaluate: () => value }
				: value,
		formule: value => {
			const child = parse(rules, rule, parsedRules)(value)

			const jsx = ({ explanation }) => makeJsx(explanation)

			return {
				evaluate: evaluateFormula,
				jsx,
				category: 'ruleProp',
				rulePropType: 'formula',
				name: 'formule',
				unit: child.unit,
				explanation: child
			}
		}
	})(rule)

	parsedRules[dottedName] = {
		// Pas de propriété explanation et jsx ici car on est parti du (mauvais)
		// principe que 'non applicable si' et 'formule' sont particuliers, alors
		// qu'ils pourraient être rangé avec les autres mécanismes
		...parsedRule,
		evaluate,
		parsed: true,
		unit:
			parsedRule.unit ??
			(parsedRule.formule?.unit && simplifyUnit(parsedRule.formule.unit)) ??
			parsedRule.defaultValue?.unit,
		isDisabledBy: [],
		replacedBy: []
	}
	parsedRules[dottedName]['rendu non applicable'] = {
		evaluate: evaluateDisabledBy,
		jsx: ({ explanation: { isDisabledBy } }) => {
			return (
				isDisabledBy.length > 0 && (
					<>
						<h3>Exception{isDisabledBy.length > 1 && 's'}</h3>
						<p>
							<Trans>Cette règle ne s'applique pas pour</Trans> :{' '}
							{isDisabledBy.map((rule, i) => (
								<React.Fragment key={i}>
									{i > 0 && ', '}
									<RuleLinkWithContext dottedName={dottedName} />
								</React.Fragment>
							))}
						</p>
					</>
				)
			)
		},
		category: 'ruleProp',
		rulePropType: 'cond',
		name: 'rendu non applicable',
		type: 'boolean',
		explanation: parsedRules[dottedName]
	}

	if (process.env.NODE_ENV === 'development') {
		Object.values(parsedRules[dottedName]['suggestions'] ?? {}).forEach(
			suggestion => {
				const parsedSuggestion = parse(rules, rule, parsedRules)(suggestion)
				if (
					!areUnitConvertible(
						parsedRules[dottedName].unit,
						parsedSuggestion.unit
					) &&
					parsedSuggestion.category !== 'reference'
				) {
					compilationError(
						dottedName,
						`La suggestion "${suggestion}" n'a pas une unité compatible avec la règle :
						"${serializeUnit(parsedRules[dottedName].unit)}" et "${serializeUnit(
							parsedSuggestion.unit
						)}"`
					)
				}
			}
		)
	}
	return parsedRules[dottedName]
}

const evaluateFormula = (cache, situation, parsedRules, node) => {
	const explanation = evaluateNode(
			cache,
			situation,
			parsedRules,
			node.explanation
		),
		{ nodeValue, unit, missingVariables, temporalValue } = explanation

	return {
		...node,
		nodeValue,
		unit,
		missingVariables,
		explanation,
		temporalValue
	}
}

const evaluateDisabledBy = (cache, situation, parsedRules, node) => {
	const isDisabledBy = node.explanation.isDisabledBy.map(disablerNode =>
		evaluateNode(cache, situation, parsedRules, disablerNode)
	)
	const nodeValue = isDisabledBy.some(
		x => x.nodeValue !== false && x.nodeValue !== null
	)
	const explanation = { ...node.explanation, isDisabledBy }
	return {
		...node,
		explanation,
		nodeValue,
		missingVariables: mergeAllMissing(isDisabledBy)
	}
}

const evaluateEvolveCond = (cache, situation, parsedRules, node) => {
	const explanation = evaluateNode(
			cache,
			situation,
			parsedRules,
			node.explanation
		),
		nodeValue = explanation.nodeValue,
		missingVariables = explanation.missingVariables

	return { ...node, nodeValue, explanation, missingVariables }
}

const evolveCond = (dottedName, rule, rules, parsedRules) => value => {
	const child = parse(rules, rule, parsedRules)(value)

	const jsx = ({ nodeValue, explanation, unit }) => (
		<Mecanism name={dottedName} value={nodeValue} unit={unit}>
			{explanation.category === 'variable' ? (
				<div className="node">{makeJsx(explanation)}</div>
			) : (
				makeJsx(explanation)
			)}
		</Mecanism>
	)

	return {
		evaluate: evaluateEvolveCond,
		jsx,
		category: 'ruleProp',
		rulePropType: 'cond',
		dottedName,
		type: 'boolean',
		explanation: child
	}
}

const evolveReplacement = (rules, rule, parsedRules) => replacements =>
	coerceArray(replacements).map(reference => {
		const referenceName =
			typeof reference === 'string' ? reference : reference.règle
		let replacementNode = reference.par
		if (replacementNode != null) {
			replacementNode = parse(rules, rule, parsedRules)(replacementNode)
		}
		const [whiteListedNames, blackListedNames] = [
			reference.dans,
			reference['sauf dans']
		]
			.map(dottedName => dottedName && coerceArray(dottedName))
			.map(
				names =>
					names &&
					names.map(dottedName =>
						disambiguateRuleReference(rules, rule.dottedName, dottedName)
					)
			)

		return {
			referenceName: disambiguateRuleReference(
				rules,
				rule.dottedName,
				referenceName
			),
			replacementNode,
			whiteListedNames,
			blackListedNames
		}
	})
