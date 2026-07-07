import { useTranslation } from 'react-i18next'

import { Avertissement } from '../profession-liberale/Avertissement'

export const AvertissementMédecin = () => {
	const { t } = useTranslation()
	const professionnelles = t(
		'pages.simulateurs.medecin.professionnelles',
		'medecins'
	)

	return <Avertissement professionnelles={professionnelles} />
}
