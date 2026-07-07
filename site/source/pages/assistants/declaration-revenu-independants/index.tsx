import { useTranslation } from 'react-i18next'

import illustration from '@/assets/images/illustration.svg'
import PageHeader from '@/components/PageHeader'
import { Body } from '@/design-system/index'

export default function AideDéclarationIndépendant() {
	const { t } = useTranslation()

	return (
		<PageHeader
			titre="L'assistant à la declaration de revenus, c'est terminé"
			picture={illustration}
		>
			<Body>
				{t(
					'pages.assistants.declaration-independant',
					'Ce dernier n’a pas rencontré le succès escompté. Nous avons donc décidé de le retirer du site. En effet, il était trop difficile de maintenir à jour les informations et les calculs.'
				)}
			</Body>
		</PageHeader>
	)
}
