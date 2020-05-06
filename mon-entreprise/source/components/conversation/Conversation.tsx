import { goToQuestion, validateStepWithValue } from 'Actions/actions'
import RuleInput from 'Components/conversation/RuleInput'
import QuickLinks from 'Components/QuickLinks'
import * as Animate from 'Components/ui/animate'
import { EngineContext } from 'Components/utils/EngineContext'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { default as React, useContext, useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
	answeredQuestionsSelector,
	situationSelector
} from 'Selectors/simulationSelectors'
import Aide from './Aide'
import './conversation.css'
import FormDecorator from './FormDecorator'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
}

export default function Conversation({ customEndMessages }: ConversationProps) {
	const dispatch = useDispatch()
	const rules = useContext(EngineContext).getParsedRules()
	const currentQuestion = useNextQuestions()[0]
	const situation = useSelector(situationSelector)
	const currentQuestionIsAnswered = !!situation[currentQuestion]

	const previousAnswers = useSelector(answeredQuestionsSelector)
	const setDefault = () =>
		dispatch(
			validateStepWithValue(
				currentQuestion,
				rules[currentQuestion]['par défaut']
			)
		)
	const goToPrevious = () =>
		dispatch(goToQuestion(previousAnswers.slice(-1)[0]))
	const handleKeyDown = ({ key }: React.KeyboardEvent) => {
		if (['Escape'].includes(key)) {
			setDefault()
		}
	}
	const submit = source =>
		dispatch({
			type: 'STEP_ACTION',
			name: 'fold',
			step: currentQuestion,
			source
		})
	const DecoratedInputComponent = FormDecorator(RuleInput)

	return currentQuestion ? (
		<>
			<Aide />
			<div tabIndex={0} style={{ outline: 'none' }} onKeyDown={handleKeyDown}>
				<Animate.fadeIn>
					<DecoratedInputComponent dottedName={currentQuestion} />
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
					{currentQuestionIsAnswered ? (
						<SendButton onSubmit={submit} />
					) : (
						<button
							onClick={setDefault}
							className="ui__ simple small push-right button"
						>
							<Trans>Passer</Trans> →
						</button>
					)}
				</div>
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

type SendButtonProps = {
	onSubmit: (cause: string) => void
}

function SendButton({ onSubmit }: SendButtonProps) {
	useEffect(() => {
		const handleKeyDown = ({ key }: KeyboardEvent) => {
			if (key !== 'Enter') return
			onSubmit('enter')
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [onSubmit])

	return (
		<button
			className="ui__ plain button "
			css="margin-left: 1.2rem"
			onClick={() => onSubmit('accept')}
		>
			<span className="text">
				<Trans>Suivant</Trans> →
			</span>
		</button>
	)
}
