import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Section } from './Section'

type Props = {
	children: ReactNode
}

export const SectionSalaireNet = ({ children }: Props) => {
	const { t } = useTranslation()

	return (
		<Section
			title={t('composants.fiche-de-paie.titres.salaire-net', 'Salaire net')}
		>
			<ul>{children}</ul>
		</Section>
	)
}
