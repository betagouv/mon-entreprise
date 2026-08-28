import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

import { Link } from '@/design-system'
import { DocumentationDeValeur } from '@/domaine/documentation/DocumentationDeValeur'

type Props = PropsWithChildren<{
	vers: DocumentationDeValeur
}>

export const DocumentationLink = ({ vers, children }: Props) => {
	const { t } = useTranslation()

	return (
		<Link
			to={vers.chemin}
			aria-label={t(
				'components.documentation.lien.aria-label',
				'Documentation : {{ titre }}',
				{ titre: vers.titre() }
			)}
		>
			{children}
		</Link>
	)
}
