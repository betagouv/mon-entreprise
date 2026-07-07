import { Trans } from 'react-i18next'

import { Body, Emoji, Link, Strong } from '@/design-system/index'
import { useSitePaths } from '@/sitePaths'

export function AvertissementAutoEntrepreneur() {
	const { absoluteSitePaths } = useSitePaths()

	return (
		<Body>
			<Emoji emoji="⚠️" />{' '}
			<Trans i18nKey="pages.simulateurs.independant.warning.auto-entrepreneur">
				Ce simulateur <Strong>ne concerne pas les auto-entrepreneurs</Strong> et
				auto-entrepreneuses, qui ont leur{' '}
				<Link to={absoluteSitePaths.simulateurs['auto-entrepreneur']}>
					simulateur de revenus
				</Link>{' '}
				dédié.
			</Trans>
		</Body>
	)
}
