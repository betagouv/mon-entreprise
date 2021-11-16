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
			<div onKeyDown={handleKeyDown}>
				<div
					css={`
						display: inline-flex;
						align-items: baseline;
					`}
				>
					<H3>{engine.getRule(currentQuestion).rawNode.question}</H3>
					<ExplicableRule dottedName={currentQuestion} />
				</div>
				<fieldset>
					<RuleInput
						dottedName={currentQuestion}
						onChange={onChange}
						key={currentQuestion}
						onSubmit={submit}
					/>
				</fieldset>
				<Spacing md />
				<Grid container spacing={2}>
					{previousAnswers.length > 0 && (
						<Grid item xs={6} sm="auto">
							<Button light onPress={goToPrevious} size="XS">
								← <Trans>Précédent</Trans>
							</Button>
						</Grid>
					)}
					<Grid item xs={6} sm="auto">
						{currentQuestionIsAnswered ? (
							<Button size="XS" onPress={() => submit('accept')}>
								<span className="text">
									<Trans>Suivant</Trans> →
								</span>
							</Button>
						) : (
							<Button onPress={setDefault} size="XS" light>
								<Trans>Passer</Trans> →
							</Button>
						)}
					</Grid>
					<Grid container item xs={12} sm justifyContent="flex-end">
						<SeeAnswersButton />
					</Grid>
				</Grid>
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
		</div>
	)
}
