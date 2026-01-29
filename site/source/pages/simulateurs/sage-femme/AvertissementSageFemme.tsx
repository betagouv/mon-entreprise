import { useTranslation } from 'react-i18next'

import { Avertissement } from '../profession-libérale/Avertissement'

export const AvertissementSageFemme = () => {
	const { t } = useTranslation()
	const professionnelles = t(
		'pages.simulateurs.sage-femme.professionnelles',
		'sages-femmes'
	)

	return <Avertissement professionnelles={professionnelles} />
}
