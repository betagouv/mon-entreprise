import { Grid } from '@mui/material'
import { goToQuestion, stepAction, updateSituation } from 'Actions/actions'
import RuleInput from 'Components/conversation/RuleInput'
import Notifications from 'Components/Notifications'
import QuickLinks from 'Components/QuickLinks'
import Emoji from 'Components/utils/Emoji'
import { EngineContext } from 'Components/utils/EngineContext'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { Button } from 'DesignSystem/buttons'
import { Spacing } from 'DesignSystem/layout'
import { H3 } from 'DesignSystem/typography/heading'
import { Body } from 'DesignSystem/typography/paragraphs'
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
import SeeAnswersButton from './SeeAnswersButton'

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
	const goToNextQuestion = () => dispatch(stepAction(currentQuestion))

	const goToPrevious = () =>
		dispatch(goToQuestion(previousAnswers.slice(-1)[0]))

	const onChange = (value: PublicodesExpression | undefined) => {
		dispatch(updateSituation(currentQuestion, value))
	}

	return currentQuestion ? (
		<>
			{Object.keys(situation).length !== 0 && (
				<TrackPage name="simulation commencée" />
			)}
			<form
				onSubmit={(e) => {
					e.preventDefault()
					goToNextQuestion()
				}}
			>
				<div
					css={`
						display: inline-flex;
						align-items: baseline;
					`}
				>
					<H3>
						{engine.getRule(currentQuestion).rawNode.question}
						<ExplicableRule light dottedName={currentQuestion} />
					</H3>
				</div>
				<fieldset>
					<RuleInput
						dottedName={currentQuestion}
						onChange={onChange}
						autoFocus
						key={currentQuestion}
						onSubmit={goToNextQuestion}
					/>
				</fieldset>
				<Spacing md />
				<button aria-hidden className="sr-only" type="submit" tabIndex={-1} />
				<Grid container spacing={2}>
					{previousAnswers.length > 0 && (
						<Grid item xs={6} sm="auto">
							<Button light onPress={goToPrevious} size="XS">
								← <Trans>Précédent</Trans>
							</Button>
						</Grid>
					)}
					<Grid item xs={6} sm="auto">
						<Button
							size="XS"
							onPress={goToNextQuestion}
							light={!currentQuestionIsAnswered}
						>
							{currentQuestionIsAnswered ? (
								<Trans>Suivant</Trans>
							) : (
								<Trans>Passer</Trans>
							)}{' '}
							→
						</Button>
					</Grid>
					<Grid container item xs={12} sm justifyContent="flex-end">
						<SeeAnswersButton />
					</Grid>
				</Grid>
				<Notifications />
			</form>
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
			<Body>
				{customEndMessages ? (
					customEndMessages
				) : (
					<Trans i18nKey="simulation-end.text">
						Vous avez maintenant accès à l'estimation la plus précise possible.
					</Trans>
				)}
			</Body>
			<SeeAnswersButton />
			<Spacing lg />
		</div>
	)
}
