import * as O from 'effect/Option'

import { PLAFOND_ANNUEL_SECURITE_SOCIALE } from '@/domaine/ConstantesSociales'
import {
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
	situation: SituationFrontalierSuisseValide,
	annéeDeCotisation: number
): DécompositionCotisationMaladie => {
	const salaires = situation.salaires.value
	const autresRevenus = situation.autresRevenus.value
	const assiette = plus(salaires, autresRevenus)

	const baseBrute = moins(
		assiette,
		abattementSécuritéSociale(annéeDeCotisation)
	)
	const base = estNégatif(baseBrute) ? eurosParAn(0) : baseBrute

	const annuel = fois(base, TAUX_COTISATION_MALADIE)
	const mensuel = toEurosParMois(annuel)

	const dateAffiliation = situation.dateAffiliation.value
	const joursAffiliation = nombreDeJoursAffiliation(dateAffiliation)
	const joursAnnée = joursDansAnnée(annéeDeCotisation)
	const affiliéEnCoursDAnnée =
		dateAffiliation.getFullYear() === annéeDeCotisation &&
		joursAffiliation < joursAnnée
	const prorataPremièreAnnée = affiliéEnCoursDAnnée
		? O.some(euros((annuel.valeur * joursAffiliation) / joursAnnée))
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
	situation: SituationFrontalierSuisseValide,
	annéeDeCotisation: number
): CotisationMaladie => {
	const { annuel, mensuel, prorataPremièreAnnée } = décomposeCotisationMaladie(
		situation,
		annéeDeCotisation
	)

	return { annuel, mensuel, prorataPremièreAnnée }
}
