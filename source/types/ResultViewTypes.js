/* @flow */
import type { RègleAvecMontant, Règle } from './RegleTypes'

export type Cotisation = Règle & {
	branche: Branche,
	montant: MontantPartagé
}

export type Branche =
	| 'protection sociale . santé'
	| 'protection sociale . accidents du travail et maladies professionnelles'
	| 'protection sociale . retraite'
	| 'protection sociale . famille'
	| 'protection sociale . assurance chômage'
	| 'protection sociale . formation'
	| 'protection sociale . transport'
	| 'protection sociale . autres'

export type MontantPartagé = {
	partSalariale: number,
	partPatronale: number
}
export type Cotisations = Array<[Règle, Array<Cotisation>]>

export type VariableWithCotisation = {
	category: 'variable',
	name: string,
	title: string,
	cotisation: {|
		'dû par'?: 'salarié' | 'employeur',
		branche?: Branche
	|},
	dottedName: string,
	nodeValue: number,
	explanation: {
		cotisation: {
			'dû par'?: 'salarié' | 'employeur',
			branche?: Branche
		},
		taxe: {
			'dû par'?: 'salarié' | 'employeur',
			branche?: Branche
		}
	}
}

export type FicheDePaie = {
	salaireBrut: RègleAvecMontant,
	avantagesEnNature: RègleAvecMontant,
	indemnitésSalarié: RègleAvecMontant,
	salaireDeBase: RègleAvecMontant,
	// TODO supprimer (cf https://github.com/betagouv/syso/issues/242)
	réductionsDeCotisations: RègleAvecMontant,
	cotisations: Cotisations,
	totalCotisations: MontantPartagé,
	salaireChargé: RègleAvecMontant,
	salaireNetDeCotisations: RègleAvecMontant,
	rémunérationNetteImposable: RègleAvecMontant,
	salaireNet: RègleAvecMontant,
	nombreHeuresTravaillées: number
}

export type Répartition = {
	répartition: Array<[Règle, MontantPartagé]>,
	total: MontantPartagé,
	salaireNet: RègleAvecMontant,
	salaireChargé: RègleAvecMontant,
	cotisationMaximum: number
}
