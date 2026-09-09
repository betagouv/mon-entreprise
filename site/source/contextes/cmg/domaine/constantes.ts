import * as M from '@/domaine/Montant'

import { TypologieDeGarde } from './typologie-de-garde'

export const DATE_RÉFORME = new Date('2025-09-01')

export const PLAFOND_DE_RESSOURCES_COUPLE_1_ENFANT = M.eurosParAn(53_119)
export const MAJORATION_PAR_ENFANT = M.eurosParAn(7_540)
export const MAJORATION_PARENT_ISOLÉ = 1.4 // +40%

export const NOMBRE_MIN_MOIS_EMPLOYEUREUSE = 2

export const PLANCHER_HEURES_DE_GARDE_PAR_TYPOLOGIE: Record<
	TypologieDeGarde,
	number
> = {
	'AMA Enfant unique 0-3 ans': 100,
	'AMA Enfant unique 3-6 ans': 50,
	'AMA Fratrie 0-3 ans': 150,
	'AMA Fratrie 0-6 ans': 100,
	GED: 50,
}

export const ANNÉE_DE_NAISSANCE_EXCLUE = 2022

export const TEH_PAR_GARDE_ET_NB_ENFANTS = {
	AMA: {
		1: 0.0619,
		2: 0.0516,
		3: 0.0413,
		4: 0.031,
		8: 0.0206,
	},
	GED: {
		1: 0.1238,
		2: 0.1032,
		3: 0.0826,
		4: 0.062,
		8: 0.0412,
	},
}

export const COÛT_HORAIRE_MAXIMAL = {
	AMA: 8,
	GED: 15,
}

export const COÛT_HORAIRE_MÉDIAN = {
	AMA: 4.85,
	GED: 10.38,
}
