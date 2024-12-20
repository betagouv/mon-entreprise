import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import RépartitionValue from '@/components/RéductionDeCotisations/RépartitionValue'
import { Strong } from '@/design-system/typography'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import {
	RéductionDottedName,
	Répartition as RépartitionType,
} from '@/utils/réductionDeCotisations'

type Props = {
	dottedName: RéductionDottedName
	répartition: RépartitionType
}

export default function Répartition({ dottedName, répartition }: Props) {
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
						idPrefix={`${dottedName} . imputation retraite complémentaire`.replace(
							/\s|\./g,
							'_'
						)}
					/>
				</StyledLi>
				<StyledLi>
					<RépartitionValue
						value={répartition.Urssaf}
						label={t(
							'pages.simulateurs.réduction-générale.répartition.urssaf',
							'URSSAF'
						)}
						idPrefix={`${dottedName} . imputation sécurité sociale`.replace(
							/\s|\./g,
							'_'
						)}
					/>
					<RépartitionValue
						value={répartition.chômage}
						label={t(
							'pages.simulateurs.réduction-générale.répartition.chômage',
							'dont chômage'
						)}
						idPrefix={`${dottedName} . imputation chômage`.replace(
							/\s|\./g,
							'_'
						)}
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
