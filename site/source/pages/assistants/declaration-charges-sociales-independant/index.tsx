import { useTranslation } from 'react-i18next'

import illustration from '@/assets/images/illustration.svg'
import PageHeader from '@/components/PageHeader'
import { Body, Link } from '@/design-system'

export default function ChargesSocialesIndépendant() {
	const { t } = useTranslation()

	return (
		<PageHeader
			titre={t(
				'pages.assistants.declaration-charges-sociales-independant.header',
				'L’assistant à la détermination des charges sociales déductibles, c’est terminé'
			)}
			picture={illustration}
		>
			<Body>
				Ce dernier est devenu obsolète avec la réforme de l’assiette sociale et
				du barème des cotisations sociales.
			</Body>
			<Body>
				Pour en savoir plus sur la réforme, consultez{' '}
				<Link
					href="https://www.urssaf.fr/accueil/independant/comprendre-payer-cotisations/reforme-cotisations-independants.html"
					aria-label={t(
						'pages.assistants.declaration-charges-sociales-independant.aria-label',
						'Lire la page dédiée sur le site de l’Urssaf, nouvelle fenêtre'
					)}
				>
					la page dédiée sur le site de l’Urssaf
				</Link>
				.
			</Body>
		</PageHeader>
	)
}
