import React, { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import SeeAnswersButton from '@/components/conversation/SeeAnswersButton'
import { VousAvezComplétéCetteSimulation } from '@/components/conversation/VousAvezComplétéCetteSimulation'
import Notifications from '@/components/Notifications'
import { ComposantQuestion } from '@/components/Simulation/ComposantQuestion'
import { FromTop } from '@/components/ui/animate'
import Progress from '@/components/ui/Progress'
import { Body, Conversation, H3, Spacing } from '@/design-system'
import { Situation } from '@/domaine/Situation'
import { useQuestions } from '@/hooks/useQuestions'

import { QuestionPublicodes } from './QuestionPublicodes'
import Raccourcis from './Raccourcis'

export interface QuestionsProps<S extends Situation = Situation> {
	situation?: S
	questions?: Array<ComposantQuestion<S>>
	avecQuestionsPublicodes?: boolean
	customEndMessages?: React.ReactNode
	customSituationVisualisation?: React.ReactNode
}

export function Questions<S extends Situation>({
	questions = [],
	avecQuestionsPublicodes = true,
	customEndMessages,
	customSituationVisualisation,
	situation,
}: QuestionsProps<S>) {
	const { t } = useTranslation()
	const focusAnchorForA11yRef = useRef<HTMLDivElement>(null)

	const {
		nombreDeQuestions,
		nombreDeQuestionsRépondues,
		activeQuestionIndex,
		QuestionCourante,
		questionCouranteRépondue,
		raccourcis,
		finished,
		goToNext,
		goToPrevious,
		goTo,
	} = useQuestions({
		questions,
		situation,
		avecQuestionsPublicodes,
	})

	const handleGoToPrevious = useCallback(() => {
		goToPrevious()

		if (focusAnchorForA11yRef.current) {
			focusAnchorForA11yRef.current.focus()
		}
	}, [goToPrevious, focusAnchorForA11yRef])

	const handleGoToNext = useCallback(() => {
		goToNext()

		if (focusAnchorForA11yRef.current) {
			focusAnchorForA11yRef.current.focus()
		}
	}, [goToNext, focusAnchorForA11yRef])

	const handleGoTo = useCallback(
		(index: string) => {
			goTo(index)

			if (focusAnchorForA11yRef.current) {
				focusAnchorForA11yRef.current.focus()
			}
		},
		[goTo, focusAnchorForA11yRef]
	)

	return (
		nombreDeQuestions > 0 && (
			<>
				<Progress
					progress={activeQuestionIndex + 1}
					maxValue={nombreDeQuestions}
				/>
				<QuestionsContainer>
					<div className="print-hidden">
						{nombreDeQuestionsRépondues < nombreDeQuestions && (
							<Body>
								{t(
									'simulateurs.précision.défaut',
									'Améliorez votre simulation en répondant aux questions :'
								)}
							</Body>
						)}
					</div>

					{finished && (
						<VousAvezComplétéCetteSimulation
							customEndMessages={customEndMessages}
							onPrevious={handleGoToPrevious}
						/>
					)}

					{!finished && QuestionCourante && (
						<FromTop key={`publicodes-question-${QuestionCourante.id}`}>
							<div ref={focusAnchorForA11yRef} tabIndex={-1} role="status">
								{QuestionCourante?._tag === 'QuestionFournie' && (
									<fieldset>
										<QuestionTitle as="legend">
											{QuestionCourante.libellé(t)}
										</QuestionTitle>
										<QuestionCourante />
										<Spacing md />
									</fieldset>
								)}

								{QuestionCourante?._tag === 'QuestionPublicodes' && (
									<QuestionPublicodes
										question={QuestionCourante}
										handleGoToNext={handleGoToNext}
									/>
								)}
							</div>

							<Conversation
								onPrevious={
									activeQuestionIndex > 0 ? handleGoToPrevious : undefined
								}
								onNext={handleGoToNext}
								questionIsAnswered={questionCouranteRépondue}
								isPreviousDisabled={activeQuestionIndex === 0}
								customVisualisation={
									avecQuestionsPublicodes ? (
										<SeeAnswersButton>
											{customSituationVisualisation}
										</SeeAnswersButton>
									) : undefined
								}
							>
								{QuestionCourante?._tag === 'QuestionFournie' && (
									/* Le contenu de la question est rendu par activeCustomQuestion.renderer */
									<div style={{ display: 'none' }}></div>
								)}
							</Conversation>

							{QuestionCourante?._tag === 'QuestionPublicodes' && (
								<Notifications />
							)}
						</FromTop>
					)}

					{QuestionCourante && (
						<Raccourcis
							raccourcis={raccourcis}
							goTo={handleGoTo}
							idQuestionCourante={QuestionCourante?.id}
						/>
					)}
				</QuestionsContainer>
			</>
		)
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

const QuestionTitle = styled(H3)`
	margin-top: 0;
`
