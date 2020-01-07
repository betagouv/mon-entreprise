import { goToQuestion, validateStepWithValue } from 'Actions/actions'
import QuickLinks from 'Components/QuickLinks'
import InputComponent from 'Engine/InputComponent'
import { findRuleByDottedName } from 'Engine/rules'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { currentQuestionSelector, flatRulesSelector, nextStepsSelector } from 'Selectors/analyseSelectors'
import * as Animate from 'Ui/animate'
import Aide from './Aide'
import './conversation.css'
import FormDecorator from './FormDecorator'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
}

export default function Conversation({ customEndMessages }: ConversationProps) {
	const dispatch = useDispatch()
	const flatRules = useSelector(flatRulesSelector)
	const currentQuestion = useSelector(currentQuestionSelector)
	const previousAnswers = useSelector(
		(state: RootState) => state.simulation?.foldedSteps || []
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
	const handleKeyDown = ({ key }: React.KeyboardEvent) => {
		if (['Escape'].includes(key)) {
			setDefault()
		}
	}
	const DecoratedInputComponent = FormDecorator(InputComponent)
	return nextSteps.length ? (
		<>
			<Aide />
			<div tabIndex={0} style={{ outline: 'none' }} onKeyDown={handleKeyDown}>
				{currentQuestion && (
					<React.Fragment key={currentQuestion}>
						<Animate.fadeIn>
							<DecoratedInputComponent
								rules={flatRules}
								dottedName={currentQuestion}
							/>
						</Animate.fadeIn>
						<div className="ui__ answer-group">
							{previousAnswers.length > 0 && (
								<>
									<button
										onClick={goToPrevious}
										className="ui__ simple small push-left button"
									>
										← <Trans>Précédent</Trans>
									</button>
								</>
							)}
							<button
								onClick={setDefault}
								className="ui__ simple small push-right button"
							>
								<Trans>Passer</Trans> →
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
				<Trans i18nKey="simulation-end.title">
					Vous avez complété cette simulation
				</Trans>{' '}
			</h3>
			<p>
				{customEndMessages ? (
					customEndMessages
				) : (
					<Trans i18nKey="simulation-end.text">
						Vous avez maintenant accès à l'estimation la plus précise possible.
					</Trans>
				)}
			</p>
		</div>
	)
}
