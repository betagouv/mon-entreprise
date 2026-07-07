import { useTranslation } from 'react-i18next'

import { Avertissement } from '../profession-liberale/Avertissement'

export const AvertissementPharmacien = () => {
	const { t } = useTranslation()
	const professionnelles = t(
		'pages.simulateurs.pharmacien.professionnelles',
		'pharmaciennes/pharmaciens'
	)

	return <Avertissement professionnelles={professionnelles} />
}
