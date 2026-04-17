import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { H4 } from '@/design-system'

import { Section } from './Section'

type Props = {
	montantNetSocial: ReactNode
	remboursementsEtRéductions: ReactNode
	netAvantImpôt: ReactNode
	impôt: ReactNode
	netAprèsImpôt: ReactNode
}

export const SectionSalaireNet = ({
	montantNetSocial,
	remboursementsEtRéductions,
	netAvantImpôt,
	impôt,
	netAprèsImpôt,
}: Props) => {
	const { t } = useTranslation()

	return (
		<Section
			title={t('composants.fiche-de-paie.titres.salaire-net', 'Salaire net')}
		>
			<ul>
				<li>{montantNetSocial}</li>
				{remboursementsEtRéductions}
				<li>{netAvantImpôt}</li>
				<li>
					<H4>
						{t(
							'composants.fiche-de-paie.salaire-net.impôt.titre',
							'Impôt sur le revenu'
						)}
					</H4>
					<ul>{impôt}</ul>
				</li>

				<li>{netAprèsImpôt}</li>
			</ul>
		</Section>
	)
}
