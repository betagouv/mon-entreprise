import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Section } from './Section'
import { Liste } from './styledComponents'

type Props = {
	children: ReactNode
}

export const SectionSalaireBrut = ({ children }: Props) => {
	const { t } = useTranslation()

	return (
		<Section
			title={t('composants.fiche-de-paie.titres.salaire-brut', 'Salaire brut')}
		>
			<Liste>{children}</Liste>
		</Section>
	)
}
