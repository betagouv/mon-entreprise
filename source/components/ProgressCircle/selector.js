import { isEmpty, values } from 'ramda'
import { missingVariablesByTargetSelector } from 'Selectors/analyseSelectors'

let computeRatio = (mvt, name) => {
	let initialNextSteps = values(mvt.initial[name] || []).length,
		currentNextSteps = values(mvt.current[name] || []).length

	// Pourquoi +1 ? Parce qu'on a déjà répondu à la question du salaire…
	return !isEmpty(mvt) && currentNextSteps / (initialNextSteps + 1)
}

export let targetCompletionRatioSelector = (state, props) => {
	return props.isActiveInput
		? null
		: computeRatio(
				missingVariablesByTargetSelector(state),
				props.target.dottedName
		  )
}
