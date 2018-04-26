import { isEmpty, values } from 'ramda'

let computeRatio = (mvt, name) => {
	let initialNextSteps = values(mvt.initial[name] || []).length,
		currentNextSteps = values(mvt.current[name] || []).length

	return !isEmpty(mvt) &&
			initialNextSteps > 0
				? currentNextSteps / initialNextSteps
				: 1
}

export let targetCompletionRatioSelector = (state, props) => {
	return props.isActiveInput
		? null
		: computeRatio(state.missingVariablesByTarget, props.target.dottedName)
}
