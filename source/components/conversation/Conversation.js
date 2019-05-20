import { resetSimulation } from 'Actions/actions'
import { T } from 'Components'
import Aide from 'Components/Aide'
import Answers from 'Components/AnswerList'
import Controls from 'Components/Controls'
import Scroll from 'Components/utils/Scroll'
import withColours from 'Components/utils/withColours'
import { getInputComponent } from 'Engine/generateQuestions'
import { compose } from 'ramda'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import {
	currentQuestionSelector,
	firstStepCompletedSelector,
	flatRulesSelector,
	nextStepsSelector
} from 'Selectors/analyseSelectors'
import * as Animate from 'Ui/animate'
import './conversation.css'

export default compose(
	withColours,
	reduxForm({
		form: 'conversation',
		destroyOnUnmount: false
	}),
	withTranslation(),

	connect(
		state => ({
			flatRules: flatRulesSelector(state),
			currentQuestion: currentQuestionSelector(state),
			firstStepCompleted: firstStepCompletedSelector(state),
			previousAnswers: state.conversationSteps.foldedSteps,
			noNextSteps: nextStepsSelector(state).length == 0
		}),
		{ resetSimulation }
	)
)(function Conversation({
	noNextSteps,
	previousAnswers,
	currentQuestion,
	customEndMessages,
	firstStepCompleted,
	flatRules,
	resetSimulation
}) {
	const arePreviousAnswers = previousAnswers.length > 0
	const [showAnswerModal, setShowAnswerModal] = useState(false)

	return (
		<>
			{showAnswerModal && <Answers onClose={() => setShowAnswerModal(false)} />}
			{firstStepCompleted && <Controls />}
			{!noNextSteps ? (
				<Scroll.toElement onlyIfNotVisible>
					<div className="conversationContainer">
						<Aide />
						<div id="currentQuestion">
							{currentQuestion && (
								<Animate.fadeIn>
									{getInputComponent(flatRules)(currentQuestion)}
								</Animate.fadeIn>
							)}
						</div>
					</div>
				</Scroll.toElement>
			) : (
				<>
					<h2>
						{emoji('🌟')}{' '}
						<T k="simulation-end.title">Situation complétée à 100%</T>{' '}
					</h2>
					<p>
						<T k="simulation-end.text">
							Nous n'avons plus de questions à poser, vous avez atteint
							l'estimation la plus précise.
						</T>
						{customEndMessages}
					</p>
				</>
			)}
			<h2>{emoji('📝 ')}Votre situation</h2>
			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-start',
					alignItems: 'baseline'
				}}>
				{arePreviousAnswers ? (
					<button
						style={{ marginRight: '1em' }}
						className="ui__ small  button "
						onClick={() => setShowAnswerModal(true)}>
						<T>Voir mes réponses</T>
					</button>
				) : (
					<span />
				)}
				<button
					className="ui__ small simple skip button left"
					onClick={() => resetSimulation()}>
					⟲ <T>Recommencer</T>
				</button>
			</div>
		</>
	)
})
