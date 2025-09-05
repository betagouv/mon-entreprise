import { Trans } from 'react-i18next'

import { Body, Link } from '@/design-system'
import { useSitePaths } from '@/sitePaths'

export default function Avertissement() {
	const { absoluteSitePaths } = useSitePaths()

	return (
		<Trans i18nKey="pages.simulateurs.eirl.avertissement">
			<Body>
				Il n’est plus possible de créer d’EIRL depuis mai 2022. Le statut d’
				<Link to={absoluteSitePaths.simulateurs['entreprise-individuelle']}>
					Entreprise Individuelle
				</Link>{' '}
				le remplace.
			</Body>
			<Body>
				Attention à ne pas confondre EIRL (Entreprise Individuelle à
				Responsabilité Limitée) avec{' '}
				<Link to={absoluteSitePaths.simulateurs.eurl}>
					EURL (Entreprise Unipersonnelle à Responsabilité Limitée)
				</Link>
				.
			</Body>
		</Trans>
	)
}
