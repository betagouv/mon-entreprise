import { Trans, useTranslation } from 'react-i18next'

import illustration from '@/assets/images/illustration.svg'
import PageHeader from '@/components/PageHeader'
import { Body, Button } from '@/design-system'

export default function ÉconomieCollaborative() {
	const { t } = useTranslation()

	return (
		<Trans>
			<PageHeader
				titre="L'assistant économie collaborative, c'est terminé"
				picture={illustration}
			>
				<Body>
					Ce dernier n'a pas rencontré le succès escompté. Nous avons donc
					décidé de le retirer du site. En effet, il était trop difficile de
					maintenir à jour les informations et les calculs.
				</Body>
				<Body>
					Pour retrouver les informations à jours, vous pouvez vous rendre sur
					le site de l'Urssaf :
				</Body>
				<Button
					href="https://www.urssaf.fr/portail/home/espaces-dedies/activites-relevant-de-leconomie.html"
					title={t(
						'Activités relevant de l’économie collaborative, voir la page'
					)}
				>
					Activités relevant de l’économie collaborative
				</Button>
			</PageHeader>
		</Trans>
	)
}
