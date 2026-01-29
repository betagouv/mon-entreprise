import { useTranslation } from 'react-i18next'

import { Avertissement } from '../profession-libérale/Avertissement'

export const AvertissementExpertComptable = () => {
	const { t } = useTranslation()
	const professionnelles = t(
		'pages.simulateurs.expert-comptable.professionnelles',
		'expertes/experts-comptables'
	)

	return <Avertissement professionnelles={professionnelles} />
}
