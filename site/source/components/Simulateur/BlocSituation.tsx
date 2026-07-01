import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { H2 } from '@/design-system'
import { Situation } from '@/domaine/Situation'
import { useQuestionsÉditorialisées } from '@/hooks/useQuestionsEditorialisees'
import {
	GroupeDeQuestionsPublicodes,
	QuestionPublicodes,
} from '@/hooks/useQuestionsPublicodesEditorialisees'

import ScrollToElement from '../utils/Scroll/ScrollToElement'
import {
	ComposantQuestionFournie,
	GroupeDeQuestionsFournies,
} from './ComposantQuestionFournie'
import { ListeQuestions } from './ListeQuestions'
import { QuestionCourante } from './QuestionCourante'
import { QuestionsPrincipales } from './QuestionsPrincipales'

type Props<S extends Situation> = {
	questionsPublicodesPrincipales?: QuestionPublicodes[]
	groupesDeQuestionsPublicodes?: Record<string, GroupeDeQuestionsPublicodes>
	questionsFourniesPrincipales?: ComposantQuestionFournie<S>[]
	groupesDeQuestionsFournies?: Record<string, GroupeDeQuestionsFournies<S>>
	situation?: S
	onReset?: () => void
}

export const BlocSituation = <S extends Situation = Situation>({
	questionsPublicodesPrincipales,
	groupesDeQuestionsPublicodes,
	questionsFourniesPrincipales,
	groupesDeQuestionsFournies,
	situation,
	onReset,
}: Props<S>) => {
	const { t } = useTranslation()
	const {
		questionsPrincipales,
		groupesDeQuestions,
		questionCourante,
		setQuestionCouranteId,
	} = useQuestionsÉditorialisées({
		questionsPublicodesPrincipales,
		groupesDeQuestionsPublicodes,
		questionsFourniesPrincipales,
		groupesDeQuestionsFournies,
		situation,
	})

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
					onClose={() => setAfficherQuestionsPrincipales(false)}
				/>
			) : questionCourante ? (
				<ScrollToElement>
					<QuestionCourante
						questions={questionCourante.liste}
						retour={() => setQuestionCouranteId(undefined)}
					/>
				</ScrollToElement>
			) : (
				<ScrollToElement>
					<ListeQuestions
						groupesDeQuestions={groupesDeQuestions}
						onSélection={setQuestionCouranteId}
						retour={() => setAfficherQuestionsPrincipales(true)}
						onReset={onReset}
					/>
				</ScrollToElement>
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
