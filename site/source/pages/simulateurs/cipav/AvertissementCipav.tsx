import { useTranslation } from 'react-i18next'

import { Avertissement } from '../profession-libérale/Avertissement'

export const AvertissementCipav = () => {
	const { t } = useTranslation()
	const professionnelles = t(
		'pages.simulateurs.cipav.professionnelles',
		'professions réglementées relevant de la Cipav'
	)

	return <Avertissement professionnelles={professionnelles} />
}
