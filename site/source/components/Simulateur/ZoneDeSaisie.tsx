import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Body } from '@/design-system'
import {
	GroupeDeQuestionsPublicodes,
	QuestionPublicodes,
} from '@/hooks/useQuestionsPublicodesEditorialisees'

import { useAutoScrollToQuestions } from './AutoScrollToQuestions'
import { BlocMontants } from './BlocMontants'
import { BlocSituation } from './BlocSituation'

type Props = {
	montants: React.ReactNode
	questionsPublicodesPrincipales: QuestionPublicodes[]
	groupesDeQuestionsPublicodes: Record<string, GroupeDeQuestionsPublicodes>
}

export const ZoneDeSaisie = ({
	montants,
	questionsPublicodesPrincipales,
	groupesDeQuestionsPublicodes,
}: Props) => {
	const { t } = useTranslation()
	const { setAutoScrollToQuestions } = useAutoScrollToQuestions()

	return (
		<>
			<BodyWithoutMargin>
				{t(
					'components.simulateur.zone-de-saisie.info-mise-à-jour',
					'Les données de simulations se mettront automatiquement à jour après la modification d’un champ.'
				)}
			</BodyWithoutMargin>

			<Container>
				<LeftColumn onFocus={() => setAutoScrollToQuestions(true)}>
					<BlocSituation
						questionsPublicodesPrincipales={questionsPublicodesPrincipales}
						groupesDeQuestionsPublicodes={groupesDeQuestionsPublicodes}
					/>
				</LeftColumn>
				<RightColumn onFocus={() => setAutoScrollToQuestions(false)}>
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
