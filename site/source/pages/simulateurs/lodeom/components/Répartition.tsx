import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Répartition as RépartitionType } from '@/contextes/salarié'
import { Body, Li, Strong, Ul } from '@/design-system'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'
import RépartitionValue from '@/pages/simulateurs/lodeom/components/RépartitionValue'

type Props = {
	idPrefix: string
	répartition: RépartitionType
}

export default function Répartition({ idPrefix, répartition }: Props) {
	const zone = useZoneLodeom()
	const { t } = useTranslation()

	const ImputationSécuritéSociale = (
		<>
			<RépartitionValue
				value={répartition.Urssaf}
				label={
					zone === 'mayotte'
						? t('pages.simulateurs.lodeom.répartition.CSSM', 'CSSM')
						: t('pages.simulateurs.lodeom.répartition.urssaf', 'Urssaf')
				}
				idPrefix={`${idPrefix}-ISS`}
			/>
			<RépartitionValue
				value={répartition.chômage}
				label={t(
					'pages.simulateurs.lodeom.répartition.chômage',
					'dont chômage'
				)}
				idPrefix={`${idPrefix}-IC`}
			/>
		</>
	)

	return (
		<>
			<Body>
				<Strong>
					<Trans>Détail du montant :</Trans>
				</Strong>
			</Body>
			{zone === 'zone un' ? (
				<StyledUl>
					<StyledLi>
						<RépartitionValue
							value={répartition.IRC}
							label={t('pages.simulateurs.lodeom.répartition.retraite', 'IRC')}
							idPrefix={`${idPrefix}-IRC`}
						/>
					</StyledLi>
					<StyledLi>{ImputationSécuritéSociale}</StyledLi>
				</StyledUl>
			) : (
				ImputationSécuritéSociale
			)}
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
