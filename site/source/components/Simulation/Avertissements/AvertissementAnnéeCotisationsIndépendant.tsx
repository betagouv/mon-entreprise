import { useTranslation } from 'react-i18next'

import useYear from '@/hooks/useYear'

export default function AvertissementAnnéeCotisationsIndépendant() {
	const { t } = useTranslation()
	const year = useYear()

	return t(
		'pages.simulateurs.indépendant.warning.année-courante',
		'Le montant calculé correspond aux cotisations de l’année {{ year }} (pour un revenu {{ year }}).',
		{ year }
	)
}
