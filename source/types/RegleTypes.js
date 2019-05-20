/* @flow */

export type Règle = {
	nom: string,
	type: string,
	id: string,
	lien: string,
	icône?: string,
	descriptionCourte?: string
}

export type RègleAvecMontant = Règle & {
	montant: number,
	applicable?: boolean
}

export type RègleValeur = {
	valeur: boolean | number | string,
	applicable?: boolean,
	type: 'boolean' | 'number' | 'string'
}

export type RègleAvecValeur = RègleValeur & Règle
