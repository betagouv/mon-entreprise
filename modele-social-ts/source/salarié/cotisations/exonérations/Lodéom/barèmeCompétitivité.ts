import { Barème } from './'

export const BarèmeCompétitivité = {
	nom: 'Compétivité',
	estÉligible: () => true,
} as const satisfies Barème
