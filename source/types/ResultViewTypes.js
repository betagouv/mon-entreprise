/* @flow */
import type { RègleAvecMontant, Règle } from './RegleTypes'

export type Cotisation = Règle & {
	branche: Branche,
	montant: MontantPartagé
}

export type Branche =
	| 'branche de la protection sociale . santé'
	| 'branche de la protection sociale . accidents du travail et maladies professionnelles'
	| 'branche de la protection sociale . retraite'
	| 'branche de la protection sociale . famille'
	| 'branche de la protection sociale . assurance chômage'
	| 'branche de la protection sociale . formation'
	| 'branche de la protection sociale . transport'
	| 'branche de la protection sociale . autres'

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
