import { goToQuestion, validateStepWithValue } from 'Actions/actions'
import { T } from 'Components'
import QuickLinks from 'Components/QuickLinks'
import { getInputComponent } from 'Engine/generateQuestions'
import { findRuleByDottedName } from 'Engine/rules'
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
		{ validateStepWithValue, goToQuestion }
	)
)(function Conversation({
	nextSteps,
	previousAnswers,
	currentQuestion,
	customEndMessages,
	flatRules,
	goToQuestion,
	validateStepWithValue
}) {
	const setDefault = () =>
		validateStepWithValue(
			currentQuestion,
			findRuleByDottedName(flatRules, currentQuestion).defaultValue
		)
	const goToPrevious = () => goToQuestion(previousAnswers.slice(-1)[0])
	const handleKeyDown = ({ key }) => {
		if (['Escape'].includes(key)) {
			setDefault()
		}
	}
	return nextSteps.length ? (
		<>
			<Aide />
			<div tabIndex="0" style={{ outline: 'none' }} onKeyDown={handleKeyDown}>
				{currentQuestion && (
					<React.Fragment key={currentQuestion}>
						<Animate.fadeIn>
							{getInputComponent(flatRules)(currentQuestion)}
						</Animate.fadeIn>
						<div className="ui__ answer-group">
							{previousAnswers.length > 0 && (
								<>
									<button
										onClick={goToPrevious}
										className="ui__ simple small skip button left">
										← Précédent
									</button>
								</>
							)}
							<button
								onClick={setDefault}
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
				<T k="simulation-end.title">Vous avez complété cette simulation</T>{' '}
			</h3>
			<p>
				{customEndMessages ? (
					customEndMessages
				) : (
					<T k="simulation-end.text">
						Vous avez maintenant accès à l'estimation la plus précise possible.
					</T>
				)}
			</p>
		</div>
	)
})
