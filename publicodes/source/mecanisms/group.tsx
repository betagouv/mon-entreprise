import { map } from 'ramda'
import { evaluateNode, mergeMissing } from '../evaluation'

const evaluate = (cache, situation, parsedRules, node) => {
	const explanation = map(
		node => evaluateNode(cache, situation, parsedRules, node),
		node.explanation
	)
	const evaluation = Object.entries(explanation).reduce(
		({ missingVariables, nodeValue }, [name, evaluation]) => {
			const mergedMissingVariables = mergeMissing(
				missingVariables,
				evaluation.missingVariables
			)
			if (evaluation.explanation.isApplicable === false) {
				return { missingVariables: mergedMissingVariables, nodeValue }
			}
			return {
				missingVariables: mergedMissingVariables,
				nodeValue: {
					[name]: evaluation.nodeValue,
					...nodeValue
				}
			}
		},
		{ missingVariables: {}, nodeValue: {} }
	)

	return { ...evaluation, explanation, ...node }
}

export const mecanismGroup = (rules: Array<string>, dottedName: string) => (
	parse,
	k,
	v
) => {
	let références: Array<string>
	if (v === 'tous') {
		références = rules
			.filter(
				name =>
					name.startsWith(dottedName) &&
					name.split(' . ').length === dottedName.split(' . ').length + 1
			)
			.map(name => name.split(' . ').slice(-1)[0])
	} else {
		références = v
	}
	const parsedRéférences = références.reduce(
		(acc, name) => ({
			...acc,
			[name]: parse(name)
		}),
		{}
	)
	return {
		explanation: parsedRéférences,
		evaluate,
		jsx: function Groupe({ explanation }) {
			return null
		},
		category: 'mecanism',
		name: 'groupe',
		type: 'groupe'
	}
}
