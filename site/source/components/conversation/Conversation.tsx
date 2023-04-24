import { DottedName } from 'modele-social'
import Engine, { PublicodesExpression } from 'publicodes'
import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import Notifications from '@/components/Notifications'
import QuickLinks from '@/components/QuickLinks'
import RuleInput from '@/components/conversation/RuleInput'
import { useEngine } from '@/components/utils/EngineContext'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { Grid, Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { useCurrentSimulatorData } from '@/hooks/useCurrentSimulatorData'
import { answerQuestion } from '@/store/actions/actions'
import {
	answeredQuestionsSelector,
	situationSelector,
} from '@/store/selectors/simulationSelectors'
import { evaluateQuestion } from '@/utils'

import { TrackPage } from '../ATInternetTracking'
import { JeDonneMonAvis } from '../JeDonneMonAvis'
import { FromTop } from '../ui/animate'
import AnswerList from './AnswerList'
import { ExplicableRule } from './Explicable'
import SeeAnswersButton from './SeeAnswersButton'
import { useNavigateQuestions } from './useNavigateQuestions'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
	customSituationVisualisation?: React.ReactNode
	engines?: Array<Engine<DottedName>>
}

export default function Conversation({
	customEndMessages,
	customSituationVisualisation,
	engines,
}: ConversationProps) {
	const { currentSimulatorData } = useCurrentSimulatorData()
	const dispatch = useDispatch()
	const engine = useEngine()

	const situation = useSelector(situationSelector)

	const previousAnswers = useSelector(answeredQuestionsSelector)

	const { t } = useTranslation()

	const { currentQuestion, currentQuestionIsAnswered, goToPrevious, goToNext } =
		useNavigateQuestions(engines)

	const onChange = (
		value: PublicodesExpression | undefined,
		dottedName: DottedName
	) => {
		dispatch(answerQuestion(dottedName, value))
	}

	const [firstRenderDone, setFirstRenderDone] = useState(false)
	useEffect(() => setFirstRenderDone(true), [])

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
								goToNext()
							}}
						>
							<div
								css={`
									display: inline-flex;
									align-items: baseline;
								`}
							>
								<H3 id="questionHeader" as="h2">
									{evaluateQuestion(engine, engine.getRule(currentQuestion))}
									<ExplicableRule
										aria-label={t('En savoir plus')}
										light
										dottedName={currentQuestion}
									/>
								</H3>
							</div>
							<fieldset>
								<legend className="sr-only">
									{t(
										'Répondez à quelques questions additionnelles afin de préciser votre résultat.'
									)}
								</legend>
								<RuleInput
									dottedName={currentQuestion}
									onChange={onChange}
									key={currentQuestion}
									onSubmit={goToNext}
									aria-labelledby="questionHeader"
								/>
							</fieldset>
							<Spacing md />
							<Grid container spacing={2}>
								{previousAnswers.length > 0 && (
									<Grid item xs={6} sm="auto">
										<Button
											color="primary"
											light
											onPress={goToPrevious}
											size="XS"
										>
											<span aria-hidden>←</span> <Trans>Précédent</Trans>
										</Button>
									</Grid>
								)}
								<Grid item xs={6} sm="auto">
									<Button
										size="XS"
										onPress={goToNext}
										light={!currentQuestionIsAnswered ? true : undefined}
										aria-label={
											currentQuestionIsAnswered
												? t('Suivant, passer à la question suivante')
												: t('Passer, passer la question sans répondre')
										}
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
						{firstRenderDone && <TrackPage name="simulation terminée" />}
						<H3 as="h2">
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
