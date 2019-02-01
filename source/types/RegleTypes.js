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
	montant: number
}

export type RègleValeur = {
	valeur: boolean | number | string,
	type: 'boolean' | 'number' | 'string'
}

export type RègleAvecValeur = RègleValeur & Règle
