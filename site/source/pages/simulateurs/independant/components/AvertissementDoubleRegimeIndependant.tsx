import { Trans } from 'react-i18next'

import { Body, Strong } from '@/design-system/index'

export function AvertissementDoubleRégimeIndépendant() {
	return (
		<Body>
			<Trans i18nKey="pages.simulateurs.independant.warning.double-régime">
				Ce simulateur ne prend pas en compte la situation des usagers ayant{' '}
				<Strong>deux régimes d’imposition différents</Strong> (régime réel et
				micro-fiscal) sur une même année.
			</Trans>
		</Body>
	)
}
