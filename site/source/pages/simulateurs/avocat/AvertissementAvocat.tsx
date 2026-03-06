import { useTranslation } from 'react-i18next'

import { Avertissement } from '../profession-libérale/Avertissement'

export const AvertissementAvocat = () => {
	const { t } = useTranslation()
	const professionnelles = t(
		'pages.simulateurs.avocat.professionnelles',
		'avocates/avocats'
	)

	return <Avertissement professionnelles={professionnelles} />
}
