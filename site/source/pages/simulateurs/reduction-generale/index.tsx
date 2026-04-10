import { useTranslation } from 'react-i18next'

import illustration from '@/assets/images/illustration.svg'
import PageHeader from '@/components/PageHeader'
import { Body } from '@/design-system'

export const RéductionGénérale = () => {
	const { t } = useTranslation()

	return (
		<PageHeader
			titre={t(
				'pages.simulateurs.réduction-générale.header',
				'Le simulateur réduction générale des cotisations, c’est terminé'
			)}
			picture={illustration}
		>
			<Body>
				{t(
					'pages.simulateurs.réduction-générale.message',
					'Nous avons décidé de le retirer du site. En effet, il demandait trop de maintenance pour un très faible usage.'
				)}
			</Body>
		</PageHeader>
	)
}
