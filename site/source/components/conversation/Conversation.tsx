import {
	answerQuestion,
	goToQuestion,
	stepAction,
	updateShouldFocusField,
} from '@/actions/actions'
import RuleInput from '@/components/conversation/RuleInput'
import Notifications from '@/components/Notifications'
import QuickLinks from '@/components/QuickLinks'
import Emoji from '@/components/utils/Emoji'
import { EngineContext } from '@/components/utils/EngineContext'
import { useNextQuestions } from '@/components/utils/useNextQuestion'
import { Button } from '@/design-system/buttons'
import { Grid, Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { CurrentSimulatorDataContext } from '@/pages/Simulateurs/metadata'
import {
	answeredQuestionsSelector,
	situationSelector,
	useMissingVariables,
} from '@/selectors/simulationSelectors'
import { evaluateQuestion } from '@/utils'
import { PublicodesExpression } from 'publicodes'
import React, { useContext, useEffect } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { TrackPage } from '../../ATInternetTracking'
import { JeDonneMonAvis } from '../JeDonneMonAvis'
import { FromTop } from '../ui/animate'
import AnswerList from './AnswerList'
import { ExplicableRule } from './Explicable'
import SeeAnswersButton from './SeeAnswersButton'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
	customSituationVisualisation?: React.ReactNode
}

export default function Conversation({
	customEndMessages,
	customSituationVisualisation,
}: ConversationProps) {
	const currentSimulatorData = useContext(CurrentSimulatorDataContext)
	const dispatch = useDispatch()
	const engine = useContext(EngineContext)
	const currentQuestion = useNextQuestions()[0]
	const situation = useSelector(situationSelector)
	const currentQuestionIsAnswered = !(currentQuestion in useMissingVariables())
	const previousAnswers = useSelector(answeredQuestionsSelector)
	useEffect(() => {
		if (currentQuestion) {
			dispatch(goToQuestion(currentQuestion))
		}
	}, [dispatch, currentQuestion])

	const goToNextQuestion = () => {
		dispatch(updateShouldFocusField(true))
		dispatch(stepAction(currentQuestion))
	}

	const goToPrevious = () => {
		dispatch(updateShouldFocusField(true))
		dispatch(goToQuestion(previousAnswers.slice(-1)[0]))
	}

	const onChange = (value: PublicodesExpression | undefined) => {
		dispatch(answerQuestion(currentQuestion, value))
	}

	return (
		<>
			<div className="print-only">
				<AnswerList
					onClose={() => {
						// do nothing.
					}}
				>
					{customSituationVisualisation}
				</AnswerList>
			</div>
			<div className="print-hidden">
				{currentQuestion ? (
					<FromTop>
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
								<H3 id="questionHeader">
									{evaluateQuestion(engine, engine.getRule(currentQuestion))}
									<ExplicableRule
										aria-label="En savoir plus"
										light
										dottedName={currentQuestion}
									/>
								</H3>
							</div>
							<fieldset>
								<RuleInput
									dottedName={currentQuestion}
									onChange={onChange}
									key={currentQuestion}
									onSubmit={goToNextQuestion}
									aria-labelledby="questionHeader"
								/>
							</fieldset>
							<Spacing md />
							<button
								aria-hidden
								className="sr-only"
								type="submit"
								tabIndex={-1}
							/>
							<Grid container spacing={2}>
								{previousAnswers.length > 0 && (
									<Grid item xs={6} sm="auto">
										<Button light onPress={goToPrevious} size="XS">
											<span aria-hidden>←</span> <Trans>Précédent</Trans>
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
										<span aria-hidden>→</span>
									</Button>
								</Grid>
								<Grid
									item
									xs={12}
									sm
									css={`
										justify-content: flex-end;
										display: flex;
									`}
								>
									<SeeAnswersButton>
										{customSituationVisualisation}
									</SeeAnswersButton>
								</Grid>
							</Grid>
							<Notifications />
						</form>
						<QuickLinks />
					</FromTop>
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
							{customEndMessages || (
								<Trans i18nKey="simulation-end.text">
									Vous avez maintenant accès à l'estimation la plus précise
									possible.
								</Trans>
							)}
						</Body>
						{currentSimulatorData?.pathId === 'simulateurs.salarié' && (
							<>
								<JeDonneMonAvis />
								<Spacing md />
							</>
						)}
						<Grid container spacing={2}>
							{previousAnswers.length > 0 && (
								<Grid item xs={6} sm="auto">
									<Button light onPress={goToPrevious} size="XS">
										<span aria-hidden>←</span> <Trans>Précédent</Trans>
									</Button>
								</Grid>
							)}
							<Grid
								item
								xs={6}
								sm
								css={`
									justify-content: flex-end;
									display: flex;
								`}
							>
								<SeeAnswersButton>
									{customSituationVisualisation}
								</SeeAnswersButton>
							</Grid>
						</Grid>
						<Spacing lg />
					</div>
				)}
			</div>
		</>
	)
}
