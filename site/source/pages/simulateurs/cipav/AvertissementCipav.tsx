import { useTranslation } from 'react-i18next'

import { Avertissement } from '../profession-libérale/Avertissement'

export const AvertissementCipav = () => {
	const { t } = useTranslation()
	// On est obligés d'utiliser un composant car nous devons par ailleurs utiliser
	// <Trans> au lieu de t() pour ne pas escaper le / (cf AvertissementAvocat.tsx)
	const Professionnelles = () => (
		<>
			{t(
				'pages.simulateurs.cipav.professionnelles',
				'professions réglementées Cipav'
			)}
		</>
	)

	return <Avertissement Professionnelles={Professionnelles} />
}
