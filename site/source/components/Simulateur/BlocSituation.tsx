import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { H2 } from '@/design-system'
import { useQuestionsÉditorialisées } from '@/hooks/useQuestionsEditorialisees'
import {
	GroupeDeQuestionsPublicodes,
	QuestionPublicodes,
} from '@/hooks/useQuestionsPublicodesEditorialisees'

import ScrollToElement from '../utils/Scroll/ScrollToElement'
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

	const [afficherQuestionsPrincipales] = useState(
		questionsPrincipales.length > 0
	)

	return (
		<Section>
			<StyledH2>
				{t('components.simulateur.zone-de-saisie.situation.titre', 'Situation')}
			</StyledH2>

			{afficherQuestionsPrincipales ? (
				<QuestionsPrincipales questions={questionsPrincipales} />
			) : questionCourante ? (
				<ScrollToElement>
					<QuestionCourante
						questions={questionCourante.liste}
						retour={() => setQuestionCouranteId(undefined)}
					/>
				</ScrollToElement>
			) : (
				<ListeQuestions
					groupesDeQuestions={groupesDeQuestions}
					onSélection={setQuestionCouranteId}
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
