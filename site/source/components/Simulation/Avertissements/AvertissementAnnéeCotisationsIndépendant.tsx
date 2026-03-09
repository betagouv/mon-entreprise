import { Trans } from 'react-i18next'

import { Strong } from '@/design-system'
import useYear from '@/hooks/useYear'

export default function AvertissementAnnéeCotisationsIndépendant() {
	const year = useYear()

	return (
		<Trans i18nKey="pages.simulateurs.indépendant.warning.année-courante">
			Le montant calculé correspond aux{' '}
			<Strong>cotisations de l’année {{ year } as unknown as number}</Strong>{' '}
			(pour un revenu {{ year }}).
		</Trans>
	)
}
