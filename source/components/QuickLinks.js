/* @flow */
import { goToQuestion } from 'Actions/actions'
import { T } from 'Components'
import { compose, contains, filter, reject, toPairs } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import {
	currentQuestionSelector,
	nextStepsSelector
} from 'Selectors/analyseSelectors'
import type { Location } from 'react-router'

type OwnProps = {
	quickLinks: { [string]: string }
}
type Props = OwnProps & {
	goToQuestion: string => void,
	location: Location,
	currentQuestion: string,
	nextSteps: Array<string>,
	quickLinksToHide: Array<string>,
	show: boolean
}

const QuickLinks = ({
	goToQuestion,
	currentQuestion,
	nextSteps,
	quickLinks,
	quickLinksToHide
}: Props) => {
	if (!quickLinks) {
		return null
	}
	const links = compose(
		toPairs,
		filter(dottedName => contains(dottedName, nextSteps)),
		reject(dottedName => contains(dottedName, quickLinksToHide))
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
						onClick={() => goToQuestion(dottedName)}>
						<T k={'quicklinks.' + label}>{label}</T>
					</button>
				))}{' '}
				{/* <button className="ui__ link-button">Voir la liste</button> */}
			</span>
		)
	)
}

export default (connect(
	(state, props) => ({
		key: props.language,
		currentQuestion: currentQuestionSelector(state),
		nextSteps: nextStepsSelector(state),
		quickLinks: state.simulation?.config.questions?.["à l'affiche"],
		quickLinksToHide: state.conversationSteps.foldedSteps
	}),
	{
		goToQuestion
	}
)(QuickLinks): React$ComponentType<OwnProps>)
