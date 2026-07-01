import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { H2, ReturnButton } from '@/design-system'
import {
	GroupeDeQuestionsPublicodes,
	QuestionPublicodes,
} from '@/domaine/questions'
import { Situation } from '@/domaine/Situation'
import { useQuestionsÉditorialisées } from '@/hooks/useQuestionsEditorialisees'

import { useAutoScrollToQuestions } from './AutoScrollToQuestions'
import {
	ComposantQuestionFournie,
	GroupeDeQuestionsFournies,
} from './Questions/ComposantQuestionFournie'
import { ListeQuestions } from './Questions/ListeQuestions'
import { QuestionCourante } from './Questions/QuestionCourante'
import { QuestionsPrincipales } from './Questions/QuestionsPrincipales'

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
				<Container>
					<QuestionCourante questions={questionCourante.liste} />

					<ReturnButton
						size="XS"
						onPress={() => {
							setQuestionCouranteId(undefined)
							setAutoScrollToQuestions(true)
						}}
						text={t(
							'components.simulateur.zone-de-saisie.situation.retour-liste',
							'Revenir à la liste'
						)}
					/>
				</Container>
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
					onReset={onReset}
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

const Container = styled.div`
	height: calc(100% - 5rem);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	row-gap: ${({ theme }) => theme.spacings.xl};
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		padding-bottom: ${({ theme }) => theme.spacings.xl};
		border-bottom: solid 1px ${({ theme }) => theme.colors.extended.grey[300]};
	}
`
