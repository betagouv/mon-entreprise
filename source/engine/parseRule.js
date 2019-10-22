import { T } from 'Components'
import { ShowValuesConsumer } from 'Components/rule/ShowValuesContext'
import RuleLink from 'Components/RuleLink'
import evaluate from 'Engine/evaluateRule'
import { parse } from 'Engine/parse'
import { evolve, fromPairs, map } from 'ramda'
import React from 'react'
import { evaluateNode, makeJsx } from './evaluation'
import { Node } from './mecanismViews/common'
import { disambiguateRuleReference, findParentDependency } from './rules'

export default (rules, rule, parsedRules) => {
	//	if (rule.dottedName.includes('distance journalière'))
	//		console.log('trr', rule, parsedRules)
	if (parsedRules[rule.dottedName]) return parsedRules[rule.dottedName]

	parsedRules[rule.dottedName] = 'being parsed'
	/*
		The parseRule function will traverse the tree of the `rule` and produce an AST, an object containing other objects containing other objects...
		Some of the attributes of the rule are dynamic, they need to be parsed. It is the case of  `non applicable si`, `applicable si`, `formule`.
		These attributes' values themselves may have  mechanism properties (e. g. `barème`) or inline expressions (e. g. `maVariable + 3`).
		These mechanisms or variables are in turn traversed by `parse()`. During this processing, 'evaluate' and'jsx' functions are attached to the objects of the AST. They will be evaluated during the evaluation phase, called "analyse".
*/

	let parentDependency = findParentDependency(rules, rule)

	let root = { ...rule, ...(parentDependency ? { parentDependency } : {}) }

	let parsedRoot = evolve({
		// Voilà les attributs d'une règle qui sont aujourd'hui dynamiques, donc à traiter
		// Les métadonnées d'une règle n'en font pas aujourd'hui partie

		// condition d'applicabilité de la règle
		parentDependency: parent => {
			let node = parse(rules, rule, parsedRules)(parent.dottedName)

			let jsx = (nodeValue, explanation) => (
				<ShowValuesConsumer>
					{showValues =>
						!showValues ? (
							<div>Active seulement si {makeJsx(explanation)}</div>
						) : nodeValue === true ? (
							<div>Active car {makeJsx(explanation)}</div>
						) : nodeValue === false ? (
							<div>Non active car {makeJsx(explanation)}</div>
						) : null
					}
				</ShowValuesConsumer>
			)

			return {
				evaluate: (cache, situation, parsedRules) =>
					node.evaluate(cache, situation, parsedRules, node),
				jsx,
				category: 'ruleProp',
				rulePropType: 'cond',
				name: 'parentDependency',
				type: 'numeric',
				explanation: node
			}
		},
		'non applicable si': evolveCond(
			'non applicable si',
			rule,
			rules,
			parsedRules
		),
		'applicable si': evolveCond('applicable si', rule, rules, parsedRules),
		'rend non applicable': nonApplicableRules =>
			nonApplicableRules.map(referenceName => {
				return disambiguateRuleReference(rules, rule, referenceName)
			}),
		// formule de calcul
		formule: evolveFormula(rules, rule, parsedRules),
		modifie: modifiers => {
			const entries = Object.entries(modifiers).map(
				([ruleName, newFormula]) => {
					return [
						ruleName,
						evolveFormula(rules, { dottedName: ruleName }, newFormula)
					]
				}
			)
			return fromPairs(entries)
		},
		contrôles: map(control => {
			let testExpression = parse(rules, rule, parsedRules)(control.si)
			if (
				!testExpression.explanation &&
				!(testExpression.category === 'reference')
			)
				throw new Error(
					'Ce contrôle ne semble pas être compris :' + control['si']
				)

			return {
				dottedName: rule.dottedName,
				level: control['niveau'],
				test: control['si'],
				message: control['message'],
				testExpression,
				solution: control['solution']
			}
		})
	})(root)

	parsedRules[rule.dottedName] = {
		// Pas de propriété explanation et jsx ici car on est parti du (mauvais) principe que 'non applicable si' et 'formule' sont particuliers, alors qu'ils pourraient être rangé avec les autres mécanismes
		...parsedRoot,
		evaluate,
		parsed: true,
		isDisabledBy: [],
		unit: rule.unit || parsedRoot.formule?.explanation?.unit
	}

	parsedRules[rule.dottedName]['rendu non applicable'] = {
		evaluate: (cache, situation, parsedRules, node) => {
			const isDisabledBy = node.explanation.isDisabledBy.map(disablerNode =>
				evaluateNode(cache, situation, parsedRules, disablerNode)
			)
			const nodeValue = isDisabledBy.some(x => x.nodeValue === true)
			const explanation = { ...node.explanation, isDisabledBy }
			return { ...node, explanation, nodeValue }
		},
		jsx: (nodeValue, { isDisabledBy }) => {
			return (
				isDisabledBy.length > 0 && (
					<>
						<h3>Exception{isDisabledBy.length > 1 && 's'}</h3>
						<p>
							<T>Cette règle ne s'applique pas pour</T> :{' '}
							{isDisabledBy.map((rule, i) => (
								<React.Fragment key={i}>
									{i > 0 && ', '}
									<RuleLink dottedName={rule.dottedName} />
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
		explanation: parsedRules[rule.dottedName]
	}

	return parsedRules[rule.dottedName]
}

let evolveCond = (name, rule, rules, parsedRules) => value => {
	let evaluate = (cache, situationGate, parsedRules, node) => {
		let explanation = evaluateNode(
				cache,
				situationGate,
				parsedRules,
				node.explanation
			),
			nodeValue = explanation.nodeValue,
			missingVariables = explanation.missingVariables

		return { ...node, nodeValue, explanation, missingVariables }
	}

	let child = parse(rules, rule, parsedRules)(value)

	let jsx = (nodeValue, explanation) => (
		<Node
			classes="ruleProp mecanism cond"
			name={name}
			value={nodeValue}
			child={
				explanation.category === 'variable' ? (
					<div className="node">{makeJsx(explanation)}</div>
				) : (
					makeJsx(explanation)
				)
			}
		/>
	)

	return {
		evaluate,
		jsx,
		category: 'ruleProp',
		rulePropType: 'cond',
		name,
		type: 'boolean',
		explanation: child
	}
}

let evolveFormula = (rules, rule, parsedRules) => value => {
	let evaluate = (cache, situationGate, parsedRules, node) => {
		let explanation = evaluateNode(
				cache,
				situationGate,
				parsedRules,
				node.explanation
			),
			nodeValue = explanation.nodeValue,
			missingVariables = explanation.missingVariables

		return { ...node, nodeValue, explanation, missingVariables }
	}

	let child = parse(rules, rule, parsedRules)(value)

	let jsx = (nodeValue, explanation) => makeJsx(explanation)

	return {
		evaluate,
		jsx,
		category: 'ruleProp',
		rulePropType: 'formula',
		name: 'formule',
		type: 'numeric',
		explanation: child
	}
}
