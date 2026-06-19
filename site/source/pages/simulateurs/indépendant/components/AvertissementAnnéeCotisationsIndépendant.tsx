import { Trans } from 'react-i18next'

import { Body, Strong } from '@/design-system'
import useYear from '@/hooks/useYear'

export function AvertissementAnnéeCotisationsIndépendant() {
	const year = useYear()

	return (
		<Body>
			<Trans i18nKey="pages.simulateurs.indépendant.warning.année-courante">
				Le montant calculé correspond aux{' '}
				<Strong>cotisations de l’année {{ year } as unknown as number}</Strong>{' '}
				(pour un revenu {{ year }}).
			</Trans>
		</Body>
	)
}
