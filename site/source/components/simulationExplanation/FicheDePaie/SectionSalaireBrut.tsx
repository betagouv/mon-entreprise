import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Section } from './Section'

type Props = {
	children: ReactNode
}

export const SectionSalaireBrut = ({ children }: Props) => {
	const { t } = useTranslation()

	return (
		<Section
			title={t('composants.fiche-de-paie.titres.salaire-brut', 'Salaire brut')}
		>
			<ul>{children}</ul>
		</Section>
	)
}
