import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import RépartitionValue from '@/components/RéductionDeCotisations/RépartitionValue'
import { Body, Li, Strong, Ul } from '@/design-system'
import { Répartition as RépartitionType } from '@/utils/réductionDeCotisations'

type Props = {
	idPrefix: string
	répartition: RépartitionType
}

export default function Répartition({ idPrefix, répartition }: Props) {
	const { t } = useTranslation()

	return (
		<>
			<Body>
				<Strong>
					<Trans>Détail du montant :</Trans>
				</Strong>
			</Body>
			<StyledUl>
				<StyledLi>
					<RépartitionValue
						value={répartition.IRC}
						label={t(
							'pages.simulateurs.réduction-générale.répartition.retraite',
							'IRC'
						)}
						idPrefix={`${idPrefix}-IRC`}
					/>
				</StyledLi>
				<StyledLi>
					<RépartitionValue
						value={répartition.Urssaf}
						label={t(
							'pages.simulateurs.réduction-générale.répartition.urssaf',
							'URSSAF'
						)}
						idPrefix={`${idPrefix}-ISS`}
					/>
					<RépartitionValue
						value={répartition.chômage}
						label={t(
							'pages.simulateurs.réduction-générale.répartition.chômage',
							'dont chômage'
						)}
						idPrefix={`${idPrefix}-IC`}
					/>
				</StyledLi>
			</StyledUl>
		</>
	)
}

const StyledUl = styled(Ul)`
	margin-top: 0;
`
const StyledLi = styled(Li)`
	&::before {
		margin-top: ${({ theme }) => theme.spacings.sm};
	}
`
