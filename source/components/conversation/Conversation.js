import { goToQuestion, resetSimulation, skipQuestion } from 'Actions/actions'
import { T } from 'Components'
import QuickLinks from 'Components/QuickLinks'
import Scroll from 'Components/utils/Scroll'
import { getInputComponent } from 'Engine/generateQuestions'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import {
	currentQuestionSelector,
	flatRulesSelector,
	nextStepsSelector
} from 'Selectors/analyseSelectors'
import * as Animate from 'Ui/animate'
import Aide from './Aide'
import './conversation.css'

export default compose(
	reduxForm({
		form: 'conversation',
		destroyOnUnmount: false
	}),
	connect(
		state => ({
			flatRules: flatRulesSelector(state),
			currentQuestion: currentQuestionSelector(state),
			previousAnswers: state.conversationSteps.foldedSteps,
			nextSteps: nextStepsSelector(state)
		}),
		{ resetSimulation, skipQuestion, goToQuestion }
	)
)(function Conversation({
	nextSteps,

	previousAnswers,
	currentQuestion,
	customEndMessages,
	flatRules,
	progress,
	resetSimulation,
	skipQuestion,
	goToQuestion
}) {
	return (
		<Scroll.toElement onlyIfNotVisible>
			{nextSteps.length ? (
				<>
					<Aide />
					<div id="currentQuestion">
						{currentQuestion && (
							<React.Fragment key={currentQuestion}>
								<Animate.fadeIn>
									{getInputComponent(flatRules)(currentQuestion)}
								</Animate.fadeIn>
								<div className="ui__ answer-group">
									{previousAnswers.length > 0 && (
										<>
											<button
												onClick={() =>
													goToQuestion(previousAnswers.slice(-1)[0])
												}
												className="ui__ simple small skip button left">
												← Précédent
											</button>
										</>
									)}
									<button
										onClick={() => skipQuestion(nextSteps[0])}
										className="ui__ simple small skip button right">
										Passer →
									</button>
								</div>
							</React.Fragment>
						)}
						<QuickLinks />
					</div>
				</>
			) : (
				<div style={{ textAlign: 'center' }}>
					<h3>
						{emoji('🌟')}{' '}
						<T k="simulation-end.title">Vous avez completé cette simulation</T>{' '}
					</h3>
					<p>
						{customEndMessages ? (
							customEndMessages
						) : (
							<T k="simulation-end.text">
								Vous avez maintenant accès à l'estimation la plus précise
								possible.
							</T>
						)}
					</p>
					<button
						className="ui__ small simple  button "
						onClick={resetSimulation}>
						<T>Recommencer</T>
					</button>
				</div>
			)}
		</Scroll.toElement>
	)
})
