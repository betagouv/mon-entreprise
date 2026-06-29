import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { H2 } from '@/design-system'
import { useQuestionsÉditorialisées } from '@/hooks/useQuestionsEditorialisees'
import {
	GroupeDeQuestionsPublicodes,
	QuestionPublicodes,
} from '@/hooks/useQuestionsPublicodesEditorialisees'

import { useAutoScrollToQuestions } from './AutoScrollToQuestions'
import { ListeQuestions } from './ListeQuestions'
import { QuestionCourante } from './QuestionCourante'
import { QuestionsPrincipales } from './QuestionsPrincipales'

type Props = {
	questionsPublicodesPrincipales: QuestionPublicodes[]
	groupesDeQuestionsPublicodes: Record<string, GroupeDeQuestionsPublicodes>
}

export const BlocSituation = ({
	questionsPublicodesPrincipales,
	groupesDeQuestionsPublicodes,
}: Props) => {
	const { t } = useTranslation()
	const {
		questionsPrincipales,
		groupesDeQuestions,
		questionCourante,
		setQuestionCouranteId,
	} = useQuestionsÉditorialisées({
		questionsPublicodesPrincipales,
		groupesDeQuestionsPublicodes,
	})

	const { setAutoScrollToQuestions } = useAutoScrollToQuestions()

	const [afficherQuestionsPrincipales, setAfficherQuestionsPrincipales] =
		useState(questionsPrincipales.length > 0)

	return (
		<Section>
			<StyledH2>
				{t('components.simulateur.zone-de-saisie.situation.titre', 'Situation')}
			</StyledH2>

			{afficherQuestionsPrincipales ? (
				<QuestionsPrincipales
					questions={questionsPrincipales}
					onClose={() => {
						setAfficherQuestionsPrincipales(false)
						setAutoScrollToQuestions(true)
					}}
				/>
			) : questionCourante ? (
				<QuestionCourante
					questions={questionCourante.liste}
					retour={() => {
						setQuestionCouranteId(undefined)
						setAutoScrollToQuestions(true)
					}}
				/>
			) : (
				<ListeQuestions
					groupesDeQuestions={groupesDeQuestions}
					onSélection={(questionId: string) => {
						setQuestionCouranteId(questionId)
						setAutoScrollToQuestions(true)
					}}
					retour={() => {
						setAfficherQuestionsPrincipales(true)
						setAutoScrollToQuestions(true)
					}}
				/>
			)}
		</Section>
	)
}

const Section = styled.section`
	height: 100%;
`

const StyledH2 = styled(H2)`
	margin: 0;
	padding: ${({ theme }) => theme.spacings.md} 0;
`
