import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { H2 } from '@/design-system'
import { Situation } from '@/domaine/Situation'
import { useQuestionsÉditorialisées } from '@/hooks/useQuestionsEditorialisees'
import { GroupeDeQuestionsPublicodes } from '@/hooks/useQuestionsPublicodesEditorialisees'

import ScrollToElement from '../utils/Scroll/ScrollToElement'
import { ListeQuestions } from './ListeQuestions'
import { QuestionCourante } from './QuestionCourante'

type Props<S extends Situation = Situation> = {
	groupesDeQuestionsPublicodes: Record<string, GroupeDeQuestionsPublicodes<S>>
}

export const BlocSituation = ({ groupesDeQuestionsPublicodes }: Props) => {
	const { t } = useTranslation()
	const { groupesDeQuestions, questionCourante, setQuestionCouranteId } =
		useQuestionsÉditorialisées({
			groupesDeQuestionsPublicodes,
		})

	return (
		<Section>
			<StyledH2>
				{t('components.simulateur.zone-de-saisie.situation.titre', 'Situation')}
			</StyledH2>

			{questionCourante ? (
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
