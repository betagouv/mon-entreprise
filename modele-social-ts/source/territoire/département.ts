import * as A from 'effect/Array'
import { dual } from 'effect/Function'

import { Situation } from '../situation'
import { CodePostal } from '../territoire'

export const Départements = defineDépartements({
	Guadeloupe: {
		code: '971',
		nom: 'Guadeloupe',
	},
	Martinique: {
		code: '971',
		nom: 'Martinique',
	},
	// TODO les autres
})

export type Département = (typeof Départements)[keyof typeof Départements]

const equals = (
	département1: Département,
	département2: Département
): boolean => département1.code === département2.code

export const estDépartement = dual<
	(département: Département) => (codePostal: CodePostal) => boolean,
	(codePostal: CodePostal, département: Département) => boolean
>(2, (codePostal: CodePostal, département: Département): boolean => {
	const found = Object.values(Départements).find((département) =>
		codePostal.startsWith(département.code)
	)

	if (!found) {
		return false
	}

	return equals(found, département)
})

export const estUnDesDépartements = dual<
	(départements: Département[]) => (codePostal: CodePostal) => boolean,
	(codePostal: CodePostal, départements: Département[]) => boolean
>(2, (codePostal: CodePostal, départements: Département[]): boolean =>
	A.some(départements, (d) => estDépartement(codePostal, d))
)

function defineDépartements<
	T extends Record<string, { code: string; nom: keyof T }>,
>(départements: T): T {
	return départements
}

export const entrepriseDansUnDesDépartements = dual<
	(départements: Département[]) => (situation: Situation) => boolean,
	(situation: Situation, départements: Département[]) => boolean
>(2, (situation: Situation, départements: Département[]): boolean =>
	estUnDesDépartements(situation.commune, départements)
)
