import { Trans } from 'react-i18next'

import { Avertissement } from '../profession-libérale/Avertissement'

export const AvertissementExpertComptable = () => {
	// On utilise un composant au lieu de t() pour ne pas escaper le /
	const Professionnelles = () => (
		<Trans i18nKey="pages.simulateurs.expert-comptable.professionnelles">
			expertes/experts-comptables
		</Trans>
	)

	return <Avertissement Professionnelles={Professionnelles} />
}
