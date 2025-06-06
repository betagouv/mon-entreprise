import { Trans } from 'react-i18next'

import PageHeader from '@/components/PageHeader'
import { Body, Button } from '@/design-system'
import { useSitePaths } from '@/sitePaths'

import illustrationSrc from './illustration.svg'

export default function AideDéclarationIndépendant() {
	const { absoluteSitePaths } = useSitePaths()

	return (
		<Trans>
			<PageHeader
				titre="L'assistant à la déclaration de revenus, c'est terminé"
				picture={illustrationSrc}
			>
				<Body>
					Ce dernier n'a pas rencontré le succès escompté. Nous avons donc
					décidé de le retirer du site. En effet, il était trop difficile de
					maintenir à jour les informations et les calculs.
				</Body>
				<Body>
					Pour les indépendants, vous pouvez calculer le montant de vos charges
					sociales déductibles grâce à notre assistant dédié :
				</Body>
				<Button
					to={
						absoluteSitePaths.assistants[
							'déclaration-charges-sociales-indépendant'
						]
					}
				>
					Assistant déclaration charges sociales indépendant
				</Button>
			</PageHeader>
		</Trans>
	)
}
