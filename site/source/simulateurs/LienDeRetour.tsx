'use client'

import { Trans } from 'react-i18next'

import { Link } from '@/design-system'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { useSitePaths } from '@/hooks/useSitePaths'
import { useNavigation } from '@/lib/navigation'

export function LienDeRetour() {
	const { absoluteSitePaths } = useSitePaths()
	const { currentPath } = useNavigation()
	const estIntégré = useIsEmbedded()

	if (estIntégré || currentPath === absoluteSitePaths.simulateurs.index) {
		return null
	}

	return (
		<Link
			className="print-hidden"
			to={absoluteSitePaths.simulateurs.index}
			noUnderline
		>
			<span aria-hidden>←</span> <Trans>Voir les autres simulateurs</Trans>
		</Link>
	)
}
