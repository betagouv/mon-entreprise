import { Either } from 'effect'

import { Montant } from '@/domaine/Montant'

import { SituationÉconomieCollaborativeValide } from './situation'

export type RéponseManquante =
	| 'typeDurée'
	| 'autresRevenus'
	| 'classement'
	| 'recettesCourteDurée'

export type TypeAssiette = 'toutes-recettes' | 'recettes-courte-durée'

export interface Assiette {
	type: TypeAssiette
	valeur: Montant<'€/an'>
}

export type RésultatApplicabilité =
	| { applicable: false }
	| { applicable: true; assiette: Assiette }

type RésultatEstApplicable = Either.Either<
	RésultatApplicabilité,
	RéponseManquante[]
>

export const NON_APPLICABLE: RésultatEstApplicable = Either.right({
	applicable: false,
})

export const applicableSurToutesRecettes = (
	valeur: Montant<'€/an'>
): RésultatEstApplicable =>
	Either.right({
		applicable: true,
		assiette: { type: 'toutes-recettes', valeur },
	})

export const applicableSurRecettesCourteDurée = (
	valeur: Montant<'€/an'>
): RésultatEstApplicable =>
	Either.right({
		applicable: true,
		assiette: { type: 'recettes-courte-durée', valeur },
	})

export type EstApplicable = (
	situation: SituationÉconomieCollaborativeValide
) => RésultatEstApplicable
