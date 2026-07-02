import { styled } from 'styled-components'

import {
	BoutonConseillersEntreprises,
	type ConseillersEntreprisesVariant,
} from '../ConseillersEntreprises/BoutonConseillersEntreprises'
import { BoutonDétail } from './BoutonDétail'
import { BoutonPartage } from './BoutonPartage'

type Props = {
	conseillersEntreprisesVariant?: ConseillersEntreprisesVariant
	afficherBoutonVersDétail: boolean
	situationMinimaleSaisie?: boolean
}

export const Actions = ({
	conseillersEntreprisesVariant,
	afficherBoutonVersDétail,
	situationMinimaleSaisie = true,
}: Props) => (
	<Container>
		<LeftColumn>
			{situationMinimaleSaisie && <BoutonPartage />}
			{conseillersEntreprisesVariant && (
				<BoutonConseillersEntreprises variant={conseillersEntreprisesVariant} />
			)}
		</LeftColumn>
		{afficherBoutonVersDétail && (
			<RightColumn>
				<BoutonDétail />
			</RightColumn>
		)}
	</Container>
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	align-items: center;
	gap: ${({ theme }) => theme.spacings.lg};
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		flex-direction: row;
		align-items: start;
	}
`

const LeftColumn = styled.div`
	order: 2;
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacings.lg};
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		flex-direction: row;
	}
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		width: calc(50% - ${({ theme }) => theme.spacings.lg});
		flex-direction: column;
	}
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.xl}) {
		flex-direction: row;
	}
`
const RightColumn = styled.div`
	/* width: 100%; */
	display: flex;
	justify-content: center;
	align-items: start;
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		order: 2;
		width: 50%;
	}
`
