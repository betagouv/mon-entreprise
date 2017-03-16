import R from 'ramda'
import {parentName, nameLeaf, findRuleByDottedName} from './rules'

export let knownVariable = (situationGate, variableName) =>
		situationGate(variableName) != null
||	situationGate(parentName(variableName)) != null
// pour 'usage', 'motif' ( le parent de 'usage') = 'usage'

export let evaluateVariable = (situationGate, variableName) => {
	let value = situationGate(variableName)

	return isNaN(value)
    ? value == 'oui' ||
        situationGate(parentName(variableName)) == nameLeaf(variableName)
		: value
}
