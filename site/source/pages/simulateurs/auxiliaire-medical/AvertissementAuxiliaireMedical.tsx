import { useTranslation } from 'react-i18next'

import { Avertissement } from '../profession-liberale/Avertissement'

export const AvertissementAuxiliaireMédical = () => {
	const { t } = useTranslation()
	const professionnelles = t(
		'pages.simulateurs.auxiliaire-medical.professionnelles',
		'auxiliaires médicales/médicaux'
	)

	return <Avertissement professionnelles={professionnelles} />
}
