import { Rules } from '@/domaine/publicodes/Rules'
import { NomModèle } from '@/domaine/SimulationConfig'

export const chargeModèle = (
	nomModèle: NomModèle
): Promise<{ default: Rules }> => {
	switch (nomModèle) {
		case 'modele-as':
			return chargeModèleAssimiléSalarié()
		case 'modele-ti':
			return chargeModèleTravailleurIndépendant()
		default:
			return chargeModèleSocial()
	}
}

// NB: import ne fonctionne pas avec des variables
const chargeModèleSocial = () => import('modele-social')
const chargeModèleAssimiléSalarié = () => import('modele-as')
const chargeModèleTravailleurIndépendant = () => import('modele-ti')
