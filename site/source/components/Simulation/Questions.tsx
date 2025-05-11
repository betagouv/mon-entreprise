import { pipe } from 'effect'
import { dedupe, filter } from 'effect/Array'
import * as O from 'effect/Option'
import { isNotUndefined, isUndefined, Predicate } from 'effect/Predicate'
import { fromEntries } from 'effect/Record'
import { DottedName } from 'modele-social'
import React, { useCallback, useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import SeeAnswersButton from '@/components/conversation/SeeAnswersButton'
import { VousAvezComplétéCetteSimulation } from '@/components/conversation/VousAvezComplétéCetteSimulation'
import { FromTop } from '@/components/ui/animate'
import Progress from '@/components/ui/Progress'
import { useEngine } from '@/components/utils/EngineContext'
import { Conversation } from '@/design-system/conversation'
import { H3 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { Situation } from '@/domaine/économie-collaborative/location-de-meublé/situation'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { enregistreLaRéponse } from '@/store/actions/actions'
import { QuestionRépondue } from '@/store/reducers/simulation.reducer'
import { questionsRéponduesSelector } from '@/store/selectors/questionsRépondues.selector'
import { questionsSuivantesSelector } from '@/store/selectors/questionsSuivantes.selector'
import { evaluateQuestion } from '@/utils/publicodes'

import { SituationStoreAdapter } from './index'
import { QuestionFournie } from './QuestionFournie'

interface QuestionPublicodes<S extends Situation> {
	_tag: 'QuestionPublicodes'
	id: DottedName
	applicable: Predicate<O.Option<S>>
	répondue: Predicate<O.Option<S>>
}

type Question<S extends Situation> = QuestionFournie<S> | QuestionPublicodes<S>

const fromQuestionPublicodeRépondue = <S extends Situation>(
	q: QuestionRépondue
): QuestionPublicodes<S> => ({
	_tag: 'QuestionPublicodes',
	id: q.règle,
	applicable: () => q.applicable,
	répondue: () => true,
})

const fromQuestionsPublicodesSuivante = <S extends Situation>(
	dottedName: DottedName
): QuestionPublicodes<S> => ({
	_tag: 'QuestionPublicodes',
	id: dottedName,
	applicable: () => true,
	répondue: () => false,
})

const fromQuestionFournie = <S extends Situation>(
	q: QuestionFournie<S>
): QuestionFournie<S> => ({
	_tag: 'QuestionFournie',
	id: q.id,
	libellé: q.libellé,
	applicable: q.applicable,
	répondue: q.répondue,
	répond: q.répond,
	renderer: q.renderer,
})

export interface QuestionsProps<S extends Situation = Situation> {
	questions?: Array<QuestionFournie<S>>
	situationAdapter?: SituationStoreAdapter<S>
	avecQuestionsPublicodes?: boolean
	customEndMessages?: React.ReactNode
	customSituationVisualisation?: React.ReactNode
}

export function Questions<S extends Situation>({
	questions = [],
	situationAdapter,
	avecQuestionsPublicodes = true,
	customEndMessages,
	customSituationVisualisation,
}: QuestionsProps<S>) {
	const dispatch = useDispatch()
	const engine = useEngine()

	const situation = useSelector(
		situationAdapter ? situationAdapter.selector : () => O.none<S>()
	)

	const publicodesQuestionsSuivantes = useSelector(questionsSuivantesSelector)
	const publicodesQuestionsRépondues = useSelector(questionsRéponduesSelector)

	const toutesLesQuestionsApplicables = pipe(
		[
			...questions.map(fromQuestionFournie),
			...(avecQuestionsPublicodes
				? [
						...publicodesQuestionsRépondues.map(fromQuestionPublicodeRépondue),
						...publicodesQuestionsSuivantes.map(
							fromQuestionsPublicodesSuivante
						),
				  ]
				: []),
		],
		filter(
			(q: Question<S>): boolean =>
				isNotUndefined(situation) && q.applicable(situation)
		)
	)

	const questionsParId = fromEntries(
		toutesLesQuestionsApplicables.map((q) => [q.id, q])
	)

	const idsDesQuestions = dedupe(Object.keys(questionsParId))

	const [activeQuestionId, setActiveQuestionId] = useState<
		Question<S>['id'] | undefined
	>(idsDesQuestions[0])
	const [finished, setFinished] = useState(false)

	useEffect(() => {
		if (activeQuestionId && !idsDesQuestions.includes(activeQuestionId)) {
			setActiveQuestionId(idsDesQuestions[0])
		}
	}, [activeQuestionId, idsDesQuestions])

	const questionCourante = isUndefined(activeQuestionId)
		? undefined
		: questionsParId[activeQuestionId]

	const handleRéponseÀUneQuestionFournie = useCallback(
		<T,>(question: QuestionFournie<S>, réponse: T) => {
			if (!situationAdapter || !situation) return

			pipe(
				question.répond(situation, réponse),
				O.map(situationAdapter.updateActionCreator),
				O.map(dispatch)
			)
		},
		[situation, situationAdapter, dispatch]
	)

	const handlePublicodesQuestionResponse = useCallback(
		(dottedName: DottedName, value: ValeurPublicodes | undefined) => {
			dispatch(enregistreLaRéponse(dottedName, value))
		},
		[dispatch]
	)

	const goToNext = useCallback(() => {
		if (!activeQuestionId) {
			return
		}

		const currentIndex = idsDesQuestions.indexOf(activeQuestionId)
		if (currentIndex < idsDesQuestions.length - 1) {
			const nextId = idsDesQuestions[currentIndex + 1]
			setActiveQuestionId(nextId)
		} else {
			setFinished(true)
		}
	}, [activeQuestionId, idsDesQuestions])

	const goToPrevious = useCallback(() => {
		if (finished) {
			setActiveQuestionId(idsDesQuestions[idsDesQuestions.length - 1])
			setFinished(false)

			return
		}

		if (!activeQuestionId) {
			return
		}

		const currentIndex = idsDesQuestions.indexOf(activeQuestionId)
		if (currentIndex > 0) {
			const prevId = idsDesQuestions[currentIndex - 1]
			setActiveQuestionId(prevId)
		}
	}, [activeQuestionId, finished, idsDesQuestions])

	if (!idsDesQuestions.length) return null

	if (!situation) return null

	const nombreDeQuestionsApplicables = toutesLesQuestionsApplicables.filter(
		(q) => q.applicable(situation)
	).length
	const nombreDeQuestionsRépondues = toutesLesQuestionsApplicables.filter((q) =>
		q.répondue(situation)
	).length

	const activeQuestionIndex = activeQuestionId
		? idsDesQuestions.indexOf(activeQuestionId)
		: -1

	const questionCouranteRépondue =
		isNotUndefined(questionCourante) && questionCourante.répondue(situation)

	return (
		<>
			<Progress
				progress={activeQuestionIndex + 1}
				maxValue={nombreDeQuestionsApplicables}
			/>
			<QuestionsContainer>
				<div className="print-hidden">
					{nombreDeQuestionsRépondues < nombreDeQuestionsApplicables && (
						<Notice>
							<Trans i18nKey="simulateurs.précision.défaut">
								Améliorez votre simulation en répondant aux questions :
							</Trans>
						</Notice>
					)}
				</div>
				{finished && (
					<VousAvezComplétéCetteSimulation
						customEndMessages={customEndMessages}
						onPrevious={goToPrevious}
					/>
				)}

				{!finished && questionCourante?._tag === 'QuestionFournie' && (
					<FromTop key={`custom-question-${activeQuestionId}`}>
						<QuestionTitle>{questionCourante.libellé}</QuestionTitle>
						{questionCourante.renderer(situation, (réponse) =>
							handleRéponseÀUneQuestionFournie(questionCourante, réponse)
						)}
						<Conversation
							onPrevious={activeQuestionIndex > 0 ? goToPrevious : undefined}
							onNext={goToNext}
							questionIsAnswered={questionCouranteRépondue}
							isPreviousDisabled={activeQuestionIndex === 0}
							customVisualisation={
								<SeeAnswersButton>
									{customSituationVisualisation}
								</SeeAnswersButton>
							}
						>
							{/* Le contenu de la question est rendu par activeCustomQuestion.renderer */}
							<div style={{ display: 'none' }}></div>
						</Conversation>
					</FromTop>
				)}

				{!finished && questionCourante?._tag === 'QuestionPublicodes' && (
					<FromTop key={`publicodes-question-${activeQuestionId}`}>
						<div
							style={{
								display: 'inline-flex',
								alignItems: 'baseline',
							}}
						>
							<H3 id="questionHeader" as="h2">
								{evaluateQuestion(engine, engine.getRule(questionCourante.id))}
								<ExplicableRule light dottedName={questionCourante.id} />
							</H3>
						</div>
						<fieldset>
							<legend className="sr-only">
								<Trans>
									Répondez à quelques questions additionnelles afin de préciser
									votre résultat.
								</Trans>
							</legend>
							<RuleInput
								dottedName={questionCourante.id}
								onChange={(value, name) =>
									handlePublicodesQuestionResponse(name, value)
								}
								key={activeQuestionId}
								onSubmit={goToNext}
								aria-labelledby="questionHeader"
							/>
						</fieldset>
						<Conversation
							onPrevious={activeQuestionIndex > 0 ? goToPrevious : undefined}
							onNext={goToNext}
							questionIsAnswered={questionCouranteRépondue}
							isPreviousDisabled={activeQuestionIndex === 0}
							customVisualisation={
								<SeeAnswersButton>
									{customSituationVisualisation}
								</SeeAnswersButton>
							}
						/>
					</FromTop>
				)}
			</QuestionsContainer>
		</>
	)
}

const QuestionsContainer = styled.div`
	padding: ${({ theme }) => ` ${theme.spacings.xs} ${theme.spacings.lg}`};
	border-radius: ${({ theme }) =>
		`0 0 ${theme.box.borderRadius} ${theme.box.borderRadius}`};
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[700]
			: theme.colors.extended.grey[100]};
	box-shadow: ${({ theme }) => theme.elevations[2]};
`

const Notice = styled(Body)`
	margin-bottom: -1rem;
`

const QuestionTitle = styled.h3`
	margin-top: 0;
	margin-bottom: 1rem;
	font-weight: 500;
`
