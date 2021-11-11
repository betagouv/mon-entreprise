import { goToQuestion, stepAction, updateSituation } from 'Actions/actions'
import RuleInput from 'Components/conversation/RuleInput'
import Notifications from 'Components/Notifications'
import QuickLinks from 'Components/QuickLinks'
import { FadeIn } from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { EngineContext } from 'Components/utils/EngineContext'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { Button } from 'DesignSystem/buttons'
import { H3 } from 'DesignSystem/typography/heading'
import { PublicodesExpression } from 'publicodes'
import React, { useContext, useEffect } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
	answeredQuestionsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import { TrackPage } from '../../ATInternetTracking'
import './conversation.css'
import { ExplicableRule } from './Explicable'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
}

export default function Conversation({ customEndMessages }: ConversationProps) {
	const dispatch = useDispatch()
	const engine = useContext(EngineContext)
	const currentQuestion = useNextQuestions()[0]
	const situation = useSelector(situationSelector)
	const currentQuestionIsAnswered = situation[currentQuestion] != null
	const previousAnswers = useSelector(answeredQuestionsSelector)
	useEffect(() => {
		if (currentQuestion) {
			dispatch(goToQuestion(currentQuestion))
		}
	}, [dispatch, currentQuestion])
	const setDefault = () => dispatch(stepAction(currentQuestion))

	const goToPrevious = () =>
		dispatch(goToQuestion(previousAnswers.slice(-1)[0]))

	const submit = (source: string) => {
		dispatch(stepAction(currentQuestion, source))
	}

	const onChange = (value: PublicodesExpression | undefined) => {
		dispatch(updateSituation(currentQuestion, value))
	}

	const handleKeyDown = ({ key }: React.KeyboardEvent) => {
		if (key === 'Escape') {
			setDefault()
		} else if (key === 'Enter') {
			submit('enter')
		}
	}

	return currentQuestion ? (
		<>
			{Object.keys(situation).length !== 0 && (
				<TrackPage name="simulation commencée" />
			)}
			<div style={{ outline: 'none' }} onKeyDown={handleKeyDown}>
				<FadeIn>
					<div className="step">
						<div
							css={`
								display: flex;
								align-items: center;
								gap: 0.5rem;
							`}
						>
							<H3>{engine.getRule(currentQuestion).rawNode.question}</H3>
							<ExplicableRule light dottedName={currentQuestion} />
						</div>

						<fieldset>
							<RuleInput
								dottedName={currentQuestion}
								onChange={onChange}
								key={currentQuestion}
								onSubmit={submit}
							/>
						</fieldset>
					</div>
				</FadeIn>

				<div className="ui__ answer-group">
					{previousAnswers.length > 0 && (
						<>
							<Button light onPress={goToPrevious} size="XS">
								← <Trans>Précédent</Trans>
							</Button>
						</>
					)}
					{currentQuestionIsAnswered ? (
						<Button size="XS" onPress={() => submit('accept')}>
							<span className="text">
								<Trans>Suivant</Trans> →
							</span>
						</Button>
					) : (
						<Button onPress={setDefault} light>
							<Trans>Passer</Trans> →
						</Button>
					)}
				</div>
				<Notifications />
			</div>
			<QuickLinks />
		</>
	) : (
		<div style={{ textAlign: 'center' }}>
			<TrackPage name="simulation terminée" />
			<H3>
				<Emoji emoji="🌟" />{' '}
				<Trans i18nKey="simulation-end.title">
					Vous avez complété cette simulation
				</Trans>
			</H3>
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
