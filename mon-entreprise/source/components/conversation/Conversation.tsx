import { goToQuestion, validateStepWithValue } from 'Actions/actions'
import QuickLinks from 'Components/QuickLinks'
import RuleInput from 'Components/conversation/RuleInput'
import React, { useContext, useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import * as Animate from 'Components/ui/animate'
import Aide from './Aide'
import './conversation.css'
import FormDecorator from './FormDecorator'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { EngineContext } from 'Components/utils/EngineContext'
import PreviousAnswers from 'sites/mon-entreprise.fr/pages/Créer/GuideStatut/PreviousAnswers'
import {
	answeredQuestionsSelector,
	currentQuestionSelector
} from 'Selectors/simulationSelectors'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
}

export default function Conversation({ customEndMessages }: ConversationProps) {
	const dispatch = useDispatch()
	const rules = useContext(EngineContext).getParsedRules()
	const currentQuestion = useNextQuestions()[0]

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
					<button
						onClick={setDefault}
						className="ui__ simple small push-right button"
					>
						<Trans>Passer</Trans> →
					</button>
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
