import { Either, pipe } from 'effect'

import { eurosParAn, Montant } from '@/domaine/Montant'

import { AffiliationObligatoire } from './erreurs'
import { vérifieActivitéNonProfessionnelle } from './estActiviteProfessionnelle'
import { SituationÉconomieCollaborativeValide } from './situation'

/**
 * Calcule les cotisations sociales pour le régime "pas d'affiliation"
 * Ce régime est applicable uniquement si l'activité n'est pas professionnelle
 * Au-dessus du seuil de professionnalisation, l'affiliation devient obligatoire
 * Les cotisations sont toujours de 0€
 * @param situation La situation avec des recettes
 * @returns 0€ de cotisations si l'activité n'est pas professionnelle, sinon une erreur
 */
export function calculeCotisationsPasDAffiliation(
	situation: SituationÉconomieCollaborativeValide
): Either.Either<Montant<'€/an'>, AffiliationObligatoire> {
	return pipe(
		vérifieActivitéNonProfessionnelle(situation),
		Either.map(() => eurosParAn(0))
	)
}
