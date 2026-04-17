import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Section } from './Section'
import { Liste, Titre } from './styledComponents'

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
			<Liste>
				<li>{montantNetSocial}</li>
				{remboursementsEtRéductions}
				<li>{netAvantImpôt}</li>
				<li>
					<Titre>
						{t(
							'composants.fiche-de-paie.salaire-net.impôt.titre',
							'Impôt sur le revenu'
						)}
					</Titre>
					<Liste>{impôt}</Liste>
				</li>

				<li>{netAprèsImpôt}</li>
			</Liste>
		</Section>
	)
}
