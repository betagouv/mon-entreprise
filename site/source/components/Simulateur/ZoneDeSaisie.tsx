import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { SmallBody } from '@/design-system'
import { Situation } from '@/domaine/Situation'
import { QuestionPublicodes } from '@/hooks/useQuestionsPublicodesEditorialisees'

import { BlocMontants } from './BlocMontants'
import { BlocSituation } from './BlocSituation'

type Props<S extends Situation = Situation> = {
	montants: React.ReactNode
	questionsPublicodes: QuestionPublicodes<S>[]
}

export const ZoneDeSaisie = ({ montants, questionsPublicodes }: Props) => {
	const { t } = useTranslation()

	return (
		<>
			<SmallBodyWithoutMargin>
				{t(
					'components.simulateur.zone-de-saisie.info-mise-à-jour',
					'Les données de simulations se mettront automatiquement à jour après la modification d’un champ.'
				)}
			</SmallBodyWithoutMargin>

			<Container>
				<LeftColumn>
					<BlocSituation questionsPublicodes={questionsPublicodes} />
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

const SmallBodyWithoutMargin = styled(SmallBody)`
	margin: 0;
`
