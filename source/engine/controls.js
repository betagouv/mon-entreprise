import { evaluateNode } from 'Engine/evaluation'
import { filter, map, path, pipe, unnest, values } from 'ramda'

let getControls = path(['explanation', 'contrôles'])
export let evaluateControls = (cache, situationGate, parsedRules) =>
	pipe(
		values,
		filter(getControls),
		map(rule =>
			getControls(rule).map(control => ({
				...control,
				evaluated: evaluateNode(
					{ ...cache, contextRule: [rule.dottedName] },
					situationGate,
					parsedRules,
					control.testExpression
				)
			}))
		),
		unnest,
		filter(control => control.evaluated.nodeValue === true)
	)(cache)
