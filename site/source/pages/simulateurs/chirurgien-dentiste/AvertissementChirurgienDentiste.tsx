import { Trans } from 'react-i18next'

import { Avertissement } from '../profession-libérale/Avertissement'

export const AvertissementChirurgienDentiste = () => {
	// On utilise un composant au lieu de t() pour ne pas escaper le /
	const Professionnelles = () => (
		<Trans i18nKey="pages.simulateurs.chirurgien-dentiste.professionnelles">
			chirurgiennes/chirurgiens-dentistes
		</Trans>
	)

	return <Avertissement Professionnelles={Professionnelles} />
}
