import { RègleModeleAssimiléSalarié } from 'modele-as'
import { RègleModeleSocial } from 'modele-social'
import { RègleModeleTravailleurIndépendant } from 'modele-ti'

export type DottedName =
	| RègleModeleSocial
	| RègleModeleAssimiléSalarié
	| RègleModeleTravailleurIndépendant
