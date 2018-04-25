import { isEmpty, values } from 'ramda'

let computeRatio = (mvt, name) =>
	!isEmpty(mvt) &&
	values(mvt.current[name]).length / values(mvt.initial[name]).length

export let targetCompletionRatioSelector = (state, props) => {
	return props.isActiveInput
		? null
		: computeRatio(state.missingVariablesByTarget, props.target.dottedName)
}
