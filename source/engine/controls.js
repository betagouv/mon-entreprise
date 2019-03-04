import { evaluateNode } from 'Engine/evaluation'
import { values, unnest, filter, map, pipe, path } from 'ramda'

let getControls = path(['explanation', 'contrôles'])
export let evaluateControls = (cache, situationGate, parsedRules) =>
	pipe(
		values,
		filter(getControls),
		map(rule =>
			getControls(rule).map(
				control =>
					!rule.inactiveParent && {
						...control,
						evaluated: evaluateNode(
							cache,
							situationGate,
							parsedRules,
							control.testExpression
						)
					}
			)
		),
		unnest,
		filter(control => control.evaluated.nodeValue === true)
	)(cache)
