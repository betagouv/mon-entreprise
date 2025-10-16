import { Either, pipe } from 'effect'

import { moins, Montant } from '@/domaine/Montant'

import { calculeCotisations } from './cotisations'
import { SimulationImpossible } from './erreurs'
import {
	RegimeCotisation,
	SituationÉconomieCollaborativeValide,
} from './situation'

/**
 * Calcule le revenu net pour un régime donné
 * @param situation La situation avec des recettes
 * @param régime Le régime de cotisation à utiliser
 * @returns Le revenu net ou une erreur
 */
export const calculeRevenuNet = (
	situation: SituationÉconomieCollaborativeValide,
	régime: RegimeCotisation
): Either.Either<Montant<'€/an'>, SimulationImpossible> =>
	pipe(
		calculeCotisations(situation, régime),
		Either.map((cotisations) =>
			pipe(situation.recettes.value, moins(cotisations))
		)
	)
