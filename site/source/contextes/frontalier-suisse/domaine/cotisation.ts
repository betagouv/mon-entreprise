import * as O from 'effect/Option'

import { PLAFOND_ANNUEL_SECURITE_SOCIALE } from '@/domaine/ConstantesSociales'
import {
	arrondirÀLEuro,
	estNégatif,
	euros,
	eurosParAn,
	fois,
	moins,
	Montant,
	plus,
	toEurosParMois,
} from '@/domaine/Montant'
import { valeurPourAnnée } from '@/domaine/ValeurAnnuelle'

import { annéeDesRevenus } from './annee-de-simulation'
import { joursDansAnnée, nombreDeJoursAffiliation } from './jours-affiliation'
import { SituationFrontalierSuisseValide } from './situation'

export const TAUX_COTISATION_MALADIE = 0.08
export const TAUX_ABATTEMENT_PASS = 0.25

export const plafondSécuritéSociale = (année: number): Montant<'€/an'> =>
	eurosParAn(valeurPourAnnée(PLAFOND_ANNUEL_SECURITE_SOCIALE, année))

export const abattementSécuritéSociale = (année: number): Montant<'€/an'> =>
	fois(plafondSécuritéSociale(année), TAUX_ABATTEMENT_PASS)

export interface CotisationMaladie {
	annuel: Montant<'€/an'>
	mensuel: Montant<'€/mois'>
	prorataPremièreAnnée: O.Option<Montant<'€'>>
}

export interface DécompositionCotisationMaladie extends CotisationMaladie {
	salaires: Montant<'€/an'>
	autresRevenus: Montant<'€/an'>
	assiette: Montant<'€/an'>
	base: Montant<'€/an'>
	joursAffiliation: number
}

export const décomposeCotisationMaladie = (
	situation: SituationFrontalierSuisseValide
): DécompositionCotisationMaladie => {
	const dateAffiliation = situation.dateAffiliation.value
	const annéeRevenus = annéeDesRevenus(dateAffiliation)

	const salaires = situation.salaires.value
	const autresRevenus = situation.autresRevenus.value
	const assiette = plus(salaires, autresRevenus)

	const baseBrute = moins(assiette, abattementSécuritéSociale(annéeRevenus))
	const base = estNégatif(baseBrute) ? eurosParAn(0) : baseBrute

	const annuel = arrondirÀLEuro(fois(base, TAUX_COTISATION_MALADIE))
	const mensuel = arrondirÀLEuro(toEurosParMois(annuel))

	const joursAffiliation = nombreDeJoursAffiliation(dateAffiliation)
	const joursAnnée = joursDansAnnée(annéeRevenus)
	const affiliéEnCoursDAnnée =
		dateAffiliation.getFullYear() === annéeRevenus &&
		joursAffiliation < joursAnnée
	const prorataPremièreAnnée = affiliéEnCoursDAnnée
		? O.some(
				arrondirÀLEuro(euros((annuel.valeur * joursAffiliation) / joursAnnée))
		  )
		: O.none()

	return {
		salaires,
		autresRevenus,
		assiette,
		base,
		joursAffiliation,
		annuel,
		mensuel,
		prorataPremièreAnnée,
	}
}

export const calculeCotisationMaladie = (
	situation: SituationFrontalierSuisseValide
): CotisationMaladie => {
	const { annuel, mensuel, prorataPremièreAnnée } =
		décomposeCotisationMaladie(situation)

	return { annuel, mensuel, prorataPremièreAnnée }
}
