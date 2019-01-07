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

export type RègleValeur =
	| {
			valeur: boolean,
			type: 'boolean'
	  }
	| { valeur: number, type: 'euros' }
	| { valeur: number, type: 'number' }
	| { valeur: string, type: 'string' }
export type RègleAvecValeur = Règle & RègleValeur
