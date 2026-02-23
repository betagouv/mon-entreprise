import { useTranslation } from 'react-i18next'

import { Avertissement } from '../profession-libérale/Avertissement'

export const AvertissementChirurgienDentiste = () => {
	const { t } = useTranslation()
	const professionnelles = t(
		'pages.simulateurs.chirurgien-dentiste.professionnelles',
		'chirurgiennes/chirurgiens-dentistes'
	)

	return <Avertissement professionnelles={professionnelles} />
}
