// Valeurs possibles de 'établissement . zone'
export type Zone = 'mayotte' | 'drom hors mayotte' | 'alsace-moselle' | 'autre'

const ZoneToDépartement: Record<Exclude<Zone, 'autre'>, string[]> = {
	mayotte: ['Mayotte'],
	'drom hors mayotte': ['Guadeloupe', 'Guyane', 'La Réunion', 'Martinique'],
	'alsace-moselle': ['Bas-Rhin', 'Haut-Rhin', 'Moselle'],
}

export const estDansLaZone = (département: string, zone?: Zone) => {
	if (!zone) {
		return true
	}

	if (zone === 'autre') {
		return !Object.values(ZoneToDépartement).flat().includes(département)
	} else {
		return ZoneToDépartement[zone].includes(département)
	}
}
