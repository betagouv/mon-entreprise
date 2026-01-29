import { useTranslation } from 'react-i18next'

import { Avertissement } from '../profession-libérale/Avertissement'

export const AvertissementMédecin = () => {
	const { t } = useTranslation()
	const professionnelles = t(
		'pages.simulateurs.médecin.professionnelles',
		'médecins'
	)

	return <Avertissement professionnelles={professionnelles} />
}
