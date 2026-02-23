import { Trans } from 'react-i18next'

import { Strong } from '@/design-system'

export default function AvertissementDoubleRégimeIndépendant() {
	return (
		<Trans i18nKey="pages.simulateurs.indépendant.warning.double-régime">
			Ce simulateur ne prend pas en compte la situation des usagers ayant{' '}
			<Strong>deux régimes d’imposition différents</Strong> (régime réel et
			micro-fiscal) sur une même année.
		</Trans>
	)
}
