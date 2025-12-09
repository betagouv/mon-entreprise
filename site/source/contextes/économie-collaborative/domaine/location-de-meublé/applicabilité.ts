import { Either } from 'effect'

import { SituationÉconomieCollaborativeValide } from './situation'

export type RéponseManquante = 'typeDurée' | 'autresRevenus' | 'classement'

export type EstApplicable = (
	situation: SituationÉconomieCollaborativeValide
) => Either.Either<boolean, RéponseManquante[]>
