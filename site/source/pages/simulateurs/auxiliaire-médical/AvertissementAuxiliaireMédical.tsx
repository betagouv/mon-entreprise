import { useTranslation } from 'react-i18next'

import { Avertissement } from '../profession-libérale/Avertissement'

export const AvertissementAuxiliaireMédical = () => {
	const { t } = useTranslation()
	const professionnelles = t(
		'pages.simulateurs.auxiliaire-médical.professionnelles',
		'auxiliaires médicales/médicaux'
	)

	return <Avertissement professionnelles={professionnelles} />
}
