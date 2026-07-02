import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Body } from '@/design-system'
import { Situation } from '@/domaine/Situation'
import {
	GroupeDeQuestionsPublicodes,
	QuestionPublicodes,
} from '@/hooks/useQuestionsPublicodesEditorialisees'

import { BlocMontants } from './BlocMontants'
import { BlocSituation } from './BlocSituation'
import {
	ComposantQuestionFournie,
	GroupeDeQuestionsFournies,
} from './ComposantQuestionFournie'

type Props<S extends Situation> = {
	montants: React.ReactNode
	questionsPublicodesPrincipales?: QuestionPublicodes[]
	groupesDeQuestionsPublicodes?: Record<string, GroupeDeQuestionsPublicodes>
	questionsFourniesPrincipales?: ComposantQuestionFournie<S>[]
	groupesDeQuestionsFournies?: Record<string, GroupeDeQuestionsFournies<S>>
	situation?: S
	situationMinimaleSaisie?: boolean
	onReset?: () => void
}

export const ZoneDeSaisie = <S extends Situation = Situation>({
	montants,
	questionsPublicodesPrincipales,
	groupesDeQuestionsPublicodes,
	questionsFourniesPrincipales,
	groupesDeQuestionsFournies,
	situation,
	situationMinimaleSaisie,
	onReset,
}: Props<S>) => {
	const { t } = useTranslation()

	return (
		<>
			<BodyWithoutMargin>
				{t(
					'components.simulateur.zone-de-saisie.info-mise-à-jour',
					'Les données de simulations se mettront automatiquement à jour après la modification d’un champ.'
				)}
			</BodyWithoutMargin>

			<Container>
				<LeftColumn>
					<BlocSituation
						questionsPublicodesPrincipales={questionsPublicodesPrincipales}
						groupesDeQuestionsPublicodes={groupesDeQuestionsPublicodes}
						questionsFourniesPrincipales={questionsFourniesPrincipales}
						groupesDeQuestionsFournies={groupesDeQuestionsFournies}
						situation={situation}
						situationMinimaleSaisie={situationMinimaleSaisie}
						onReset={onReset}
					/>
				</LeftColumn>
				<RightColumn>
					<BlocMontants>{montants}</BlocMontants>
				</RightColumn>
			</Container>
		</>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	gap: ${({ theme }) => theme.spacings.xl};
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		flex-direction: row;
	}
`

const LeftColumn = styled.div`
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		width: calc(50% - ${({ theme }) => theme.spacings.md});
	}
`

const RightColumn = styled.div`
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		width: calc(50% - ${({ theme }) => theme.spacings.md});
	}
`

const BodyWithoutMargin = styled(Body)`
	margin: 0;
`
