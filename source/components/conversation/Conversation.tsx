import { goToQuestion, validateStepWithValue } from 'Actions/actions'
import { T } from 'Components'
import QuickLinks from 'Components/QuickLinks'
import getInputComponent from 'Engine/getInputComponent'
import { findRuleByDottedName } from 'Engine/rules'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import {
	currentQuestionSelector,
	flatRulesSelector,
	nextStepsSelector,
} from 'Selectors/analyseSelectors'
import * as Animate from 'Ui/animate'
import Aide from './Aide'
import './conversation.css'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
}

export default function Conversation({
	customEndMessages,
	customEnd,
}: ConversationProps) {
	const dispatch = useDispatch()
	const flatRules = useSelector(flatRulesSelector)
	const currentQuestion = useSelector(currentQuestionSelector)
	const previousAnswers = useSelector(
		(state: RootState) => state.conversationSteps.foldedSteps
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

	const questionCategory = findRuleByDottedName(
		flatRules,
		currentQuestion.split(' . ')[0]
	)

	return nextSteps.length ? (
		<>
			<Aide />
			<div tabIndex={0} style={{ outline: 'none' }} onKeyDown={handleKeyDown}>
				{currentQuestion && (
					<React.Fragment key={currentQuestion}>
						<div>
							<span
								css={`
									background: darkblue;
									color: white;
									border-radius: 0.3rem;
									padding: 0.15rem 0.6rem;
									text-transform: uppercase;
									img {
										margin: 0 0.6rem 0 0 !important;
									}
								`}
							>
								{emoji(questionCategory.icônes || '🌍')}
								{questionCategory.title}
							</span>
						</div>
						<Animate.fadeIn>
							{getInputComponent(flatRules)(currentQuestion)}
						</Animate.fadeIn>
						<div className="ui__ answer-group">
							{previousAnswers.length > 0 && (
								<>
									<button
										onClick={goToPrevious}
										className="ui__ simple small push-left button"
									>
										← <T>Précédent</T>
									</button>
								</>
							)}
							<button
								onClick={setDefault}
								className="ui__ simple small push-right button"
							>
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
			{customEnd || (
				<>
					<EndingCongratulations />
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
						onClick={resetSimulation}
					>
						<T>Recommencer</T>
					</button>
				</>
			)}
		</div>
	)
}

export let EndingCongratulations = () => (
	<h3>
		{emoji('🌟')}{' '}
		<T k="simulation-end.title">Vous avez complété cette simulation</T>{' '}
	</h3>
)
