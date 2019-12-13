import { goToQuestion } from 'Actions/actions'
import { T } from 'Components'
import { contains, filter, pipe, reject, toPairs } from 'ramda'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import {
	currentQuestionSelector,
	nextStepsSelector
} from 'Selectors/analyseSelectors'
import { DottedName } from 'Types/rule'

export default function QuickLinks() {
	const currentQuestion = useSelector(currentQuestionSelector)
	const nextSteps = useSelector(nextStepsSelector)
	const quickLinks = useSelector(
		(state: RootState) => state.simulation?.config.questions?.["à l'affiche"]
	)
	const quickLinksToHide = useSelector(
		(state: RootState) => state.conversationSteps.foldedSteps
	)
	const dispatch = useDispatch()

	if (!quickLinks) {
		return null
	}
	const links = pipe(
		reject((dottedName: DottedName) => contains(dottedName, quickLinksToHide)),
		filter((dottedName: DottedName) => contains(dottedName, nextSteps)),
		toPairs
	)(quickLinks)

	return (
		!!links.length && (
			<span>
				<small>Questions :</small>
				{links.map(([label, dottedName]) => (
					<button
						key={dottedName}
						className={`ui__ link-button ${
							dottedName === currentQuestion ? 'active' : ''
						}`}
						css="margin: 0 0.4rem !important"
						onClick={() => dispatch(goToQuestion(dottedName))}
					>
						<T k={'quicklinks.' + label}>{label}</T>
					</button>
				))}{' '}
				{/* <button className="ui__ link-button">Voir la liste</button> */}
			</span>
		)
	)
}
