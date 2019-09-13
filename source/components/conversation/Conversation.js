import { goToQuestion, validateStepWithValue } from 'Actions/actions'
import { T } from 'Components'
import QuickLinks from 'Components/QuickLinks'
import { getInputComponent } from 'Engine/generateQuestions'
import { findRuleByDottedName } from 'Engine/rules'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import {
	currentQuestionSelector,
	flatRulesSelector,
	nextStepsSelector
} from 'Selectors/analyseSelectors'
import * as Animate from 'Ui/animate'
import Aide from './Aide'
import './conversation.css'

export default function Conversation({ customEndMessages }) {
	const dispatch = useDispatch()
	const flatRules = useSelector(flatRulesSelector)
	const currentQuestion = useSelector(currentQuestionSelector)
	const previousAnswers = useSelector(
		state => state.conversationSteps.foldedSteps
	)
	const nextSteps = useSelector(nextStepsSelector)

	const setDefault = () =>
		dispatch(
			validateStepWithValue(
				currentQuestion,
				findRuleByDottedName(flatRules, currentQuestion).defaultValue
			)
		)
	const goToPrevious = () =>
		dispatch(goToQuestion(previousAnswers.slice(-1)[0]))
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
										← <T>Précédent</T>
									</button>
								</>
							)}
							<button
								onClick={setDefault}
								className="ui__ simple small skip button right">
								<T>Passer</T> →
							</button>
						</div>
					</React.Fragment>
				)}
			</div>
			<QuickLinks />
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
}
