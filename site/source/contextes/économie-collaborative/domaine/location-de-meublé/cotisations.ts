import { Either } from 'effect'

import { Montant } from '@/domaine/Montant'

import { SimulationImpossible } from './erreurs'
import { calculeCotisationsRégimeGénéral } from './régime-général'
import { calculeCotisationsMicroEntreprise } from './régime-micro-entreprise'
import { calculeCotisationsSécuritéSocialeDesIndépendants } from './régime-sécurité-sociale-indépendants'
import {
	RegimeCotisation,
	SituationÉconomieCollaborativeValide,
} from './situation'

export const DEFAULTS = {
	EST_ALSACE_MOSELLE: false,
	PREMIERE_ANNEE: false,
}

/**
 * Calcule les cotisations sociales pour un régime donné
 * @param situation La situation avec recettes
 * @param régime Le régime de cotisation
 * @returns Un Either contenant soit les cotisations calculées, soit une erreur
 */
export function calculeCotisations(
	situation: SituationÉconomieCollaborativeValide,
	régime: RegimeCotisation
): Either.Either<Montant<'€/an'>, SimulationImpossible> {
	switch (régime) {
		case RegimeCotisation.regimeGeneral:
			return calculeCotisationsRégimeGénéral(situation)
		case RegimeCotisation.microEntreprise:
			return calculeCotisationsMicroEntreprise(situation)
		case RegimeCotisation.travailleurIndependant:
			return calculeCotisationsSécuritéSocialeDesIndépendants(situation)
	}
}
