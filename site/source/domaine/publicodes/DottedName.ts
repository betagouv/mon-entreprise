import { RègleModèleAssimiléSalarié } from 'modele-as'
import { RègleModèleSocial } from 'modele-social'
import { RègleModèleTravailleurIndépendant } from 'modele-ti'

export type DottedName =
	| RègleModèleSocial
	| RègleModèleAssimiléSalarié
	| RègleModèleTravailleurIndépendant
