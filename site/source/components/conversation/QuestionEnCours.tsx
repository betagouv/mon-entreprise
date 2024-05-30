import { DottedName } from 'modele-social'
import Engine, { PublicodesExpression } from 'publicodes'
import React, { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { TrackPage } from '@/components/ATInternetTracking'
import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import SeeAnswersButton from '@/components/conversation/SeeAnswersButton'
import { useNavigateQuestions } from '@/components/conversation/useNavigateQuestions'
import Notifications from '@/components/Notifications'
import QuickLinks from '@/components/QuickLinks'
import { FromTop } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Button } from '@/design-system/buttons'
import { Grid } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { enregistreLaRéponse } from '@/store/actions/actions'
import { estSurLaPremièreQuestionRépondueSelector } from '@/store/selectors/estSurLaPremièreQuestionRépondue.selector'
import { situationSelector } from '@/store/selectors/simulationSelectors'
import { evaluateQuestion } from '@/utils'

interface Props {
	previousAnswers: DottedName[]
	customSituationVisualisation?: React.ReactNode
}

export function QuestionEnCours({
	previousAnswers,
	customSituationVisualisation,
}: Props) {
	const dispatch = useDispatch()
	const { t } = useTranslation()

	const engine = useEngine()

	const situation = useSelector(situationSelector)

	const { currentQuestion, currentQuestionIsAnswered, goToPrevious, goToNext } =
		useNavigateQuestions()

	const formRef = React.useRef<HTMLFormElement>(null)

	const focusFirstElemInForm = useCallback(() => {
		setTimeout(() => {
			formRef.current
				?.querySelector<HTMLInputElement | HTMLButtonElement | HTMLLinkElement>(
					'input, button, a'
				)
				?.focus()
		}, 5)
	}, [])

	const handleGoToPrevious = useCallback(() => {
		goToPrevious()
		focusFirstElemInForm()
	}, [focusFirstElemInForm, goToPrevious])

	const handleGoToNext = useCallback(() => {
		goToNext()
		focusFirstElemInForm()
	}, [focusFirstElemInForm, goToNext])

	const estSurLaPremièreQuestion = useSelector(
		estSurLaPremièreQuestionRépondueSelector
	)

	if (!currentQuestion) return null

	const onChange = (
		value: PublicodesExpression | undefined,
		dottedName: DottedName
	) => {
		dispatch(enregistreLaRéponse(dottedName, value))
	}

	const isDateQuestion =
		currentQuestion && engine.getRule(currentQuestion).rawNode.type === 'date'

	return (
		<FromTop>
			{Object.keys(situation).length !== 0 && (
				<TrackPage name="simulation commencée" />
			)}
			<form
				onSubmit={(e) => {
					e.preventDefault()
					handleGoToNext()
				}}
				ref={formRef}
			>
				<div
					style={{
						display: 'inline-flex',
						alignItems: 'baseline',
					}}
				>
					<H3 id="questionHeader" as="h2">
						{evaluateQuestion(engine, engine.getRule(currentQuestion))}
						<ExplicableRule light dottedName={currentQuestion} />
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
						onSubmit={handleGoToNext}
						aria-labelledby="questionHeader"
						hideDefaultValue={isDateQuestion}
					/>
				</fieldset>
				<Grid container spacing={2}>
					{previousAnswers.length > 0 && !estSurLaPremièreQuestion && (
						<Grid item xs={6} sm="auto">
							<Button
								color="primary"
								light
								onPress={handleGoToPrevious}
								size="XS"
							>
								<span aria-hidden>←</span> <Trans>Précédent</Trans>
							</Button>
						</Grid>
					)}
					<Grid item xs={6} sm="auto">
						<Button
							size="XS"
							onPress={handleGoToNext}
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
						style={{
							justifyContent: 'flex-end',
							display: 'flex',
						}}
					>
						<SeeAnswersButton>{customSituationVisualisation}</SeeAnswersButton>
					</Grid>
				</Grid>
				<Notifications />
			</form>
			<QuickLinks />
		</FromTop>
	)
}
