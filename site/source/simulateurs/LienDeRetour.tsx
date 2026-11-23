'use client'

import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Link } from '@/design-system'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { useSitePaths } from '@/hooks/useSitePaths'
import { useNavigation } from '@/lib/navigation'
import { companySirenSelector } from '@/store/selectors/company/companySiren.selector'

export function LienDeRetour() {
	const { absoluteSitePaths } = useSitePaths()
	const { currentPath } = useNavigation()
	const isEmbedded = useIsEmbedded()
	const siren = useSelector(companySirenSelector)

	if (isEmbedded || currentPath === absoluteSitePaths.simulateurs.index) {
		return null
	}

	const to = siren
		? absoluteSitePaths.assistants['pour-mon-entreprise'].entreprise.replace(
				':entreprise',
				String(siren)
			)
		: absoluteSitePaths.simulateurs.index

	const label = siren ? (
		<Trans>Retour à mon activité</Trans>
	) : (
		<Trans>Voir les autres simulateurs</Trans>
	)

	return (
		<Link className="print-hidden" to={to} noUnderline>
			<span aria-hidden>←</span> {label}
		</Link>
	)
}
