import { Either, Option, pipe } from 'effect'

import { estPlusGrandOuÉgalÀ, eurosParAn, Montant } from '@/domaine/Montant'

import {
	AffiliationObligatoire,
	RégimeNonApplicablePourCeTypeDeDurée,
} from './erreurs'
import { estActivitéPrincipale } from './estActivitéPrincipale'
import {
	SEUIL_PROFESSIONNALISATION,
	vérifieActivitéNonProfessionnelle,
} from './estActiviteProfessionnelle'
import {
	RegimeCotisation,
	SituationÉconomieCollaborativeValide,
	situationParDéfaut,
} from './situation'

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
): Either.Either<
	Montant<'€/an'>,
	AffiliationObligatoire | RégimeNonApplicablePourCeTypeDeDurée
> {
	const recettes = situation.recettes.value

	if (pipe(recettes, estPlusGrandOuÉgalÀ(SEUIL_PROFESSIONNALISATION.MEUBLÉ))) {
		const typeDurée = Option.getOrElse(
			situation.typeDurée,
			() => situationParDéfaut.typeDurée
		)

		const estPrincipale = estActivitéPrincipale(situation)

		if (estPrincipale || typeDurée === 'courte') {
			return Either.left(
				new RégimeNonApplicablePourCeTypeDeDurée({
					typeDurée,
					régime: RegimeCotisation.pasDAffiliation,
					estActivitéPrincipale: estPrincipale,
				})
			)
		}
	}

	return pipe(
		vérifieActivitéNonProfessionnelle(situation),
		Either.map(() => eurosParAn(0))
	)
}
