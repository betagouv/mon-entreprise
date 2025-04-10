import { Option } from 'effect'
import React, { useCallback } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import Conversation, {
	ConversationProps,
} from '@/components/conversation/Conversation'
import Progress from '@/components/ui/Progress'
import { Body } from '@/design-system/typography/paragraphs'
import { Situation } from '@/domaine/économie-collaborative/location-de-meublé/situation'
import { useSimulationProgress } from '@/hooks/useSimulationProgress'
import { ilYADesQuestionsSelector } from '@/store/selectors/ilYADesQuestions.selector'

import { SituationStoreAdapter } from './index'
import { Question, QuestionQuelconque } from './Question'

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

const QuestionBlock = styled.div`
	margin: 1rem 0 1.5rem;
	padding: 1rem 0;
	border-bottom: 1px solid ${({ theme }) => theme.colors.extended.grey[300]};

	&:last-child {
		border-bottom: none;
	}
`

const QuestionTitle = styled.h3`
	margin-top: 0;
	margin-bottom: 1rem;
	font-weight: 500;
`

export interface QuestionsProps<S extends Situation = Situation> {
	questions?: Array<QuestionQuelconque<S>>
	situationAdapter?: SituationStoreAdapter<S>
	avecQuestionsPublicodes?: boolean
	customEndMessages?: ConversationProps['customEndMessages']
	customSituationVisualisation?: React.ReactNode
}

export function Questions<S extends Situation>({
	questions = [],
	situationAdapter,
	avecQuestionsPublicodes = true,
	customEndMessages,
	customSituationVisualisation,
}: QuestionsProps<S>) {
	const { numberCurrentStep, numberSteps } = useSimulationProgress()
	const dispatch = useDispatch()
	const ilYADesQuestions = useSelector(ilYADesQuestionsSelector)

	const hasCustomQuestions = questions.length > 0 && situationAdapter
	const shouldShowPublicodesQuestions =
		avecQuestionsPublicodes && ilYADesQuestions

	if (!hasCustomQuestions && !shouldShowPublicodesQuestions) {
		return null
	}

	const situationOption = hasCustomQuestions
		? useSelector(situationAdapter.selector)
		: Option.none<S>()

	const applicableQuestions = hasCustomQuestions
		? Option.match(situationOption, {
				onNone: () => [],
				onSome: (situation) => questions.filter((q) => q.applicable(situation)),
		  })
		: []

	const handleRéponse = useCallback(
		<T,>(question: Question<S, T>, réponse: T) => {
			if (!situationAdapter) return

			Option.match(situationOption, {
				onNone: () => {
					// Pas de situation, rien à faire
					console.warn(
						'Tentative de répondre à une question sans situation existante'
					)
				},
				onSome: (situation) => {
					// Mise à jour de la situation avec la réponse
					const nouvelleSituation = question.répond(situation, réponse)
					dispatch(situationAdapter.updateActionCreator(nouvelleSituation))
				},
			})
		},
		[situationOption, dispatch, situationAdapter]
	)

	return (
		<>
			<Progress progress={numberCurrentStep} maxValue={numberSteps + 1} />
			<QuestionsContainer>
				<div className="print-hidden">
					{numberCurrentStep < numberSteps && (
						<Notice>
							<Trans i18nKey="simulateurs.précision.défaut">
								Améliorez votre simulation en répondant aux questions :
							</Trans>
						</Notice>
					)}
				</div>

				{/* Questions personnalisées */}
				{applicableQuestions.map((question, index) => (
					<QuestionBlock key={`custom-question-${index}`}>
						<QuestionTitle>{question.libellé}</QuestionTitle>
						{Option.match(situationOption, {
							onNone: () => null,
							onSome: (situation) =>
								question.renderer(situation, (réponse) =>
									handleRéponse(question, réponse)
								),
						})}
					</QuestionBlock>
				))}

				{/* Questions générées par Publicodes */}
				{shouldShowPublicodesQuestions && (
					<Conversation
						customEndMessages={customEndMessages}
						customSituationVisualisation={customSituationVisualisation}
					/>
				)}
			</QuestionsContainer>
		</>
	)
}
