import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Body } from '@/design-system'
import { Situation } from '@/domaine/Situation'
import { GroupeDeQuestionsPublicodes } from '@/hooks/useQuestionsPublicodesEditorialisees'

import { BlocMontants } from './BlocMontants'
import { BlocSituation } from './BlocSituation'

type Props<S extends Situation = Situation> = {
	montants: React.ReactNode
	groupesDeQuestionsPublicodes: Record<string, GroupeDeQuestionsPublicodes<S>>
}

export const ZoneDeSaisie = ({
	montants,
	groupesDeQuestionsPublicodes,
}: Props) => {
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
						groupesDeQuestionsPublicodes={groupesDeQuestionsPublicodes}
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
