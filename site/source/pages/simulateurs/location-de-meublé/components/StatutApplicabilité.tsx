import { Either, pipe } from 'effect'
import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import {
	type RéponseManquante,
	type RésultatApplicabilité,
} from '@/contextes/économie-collaborative'
import { SmallBody, Strong, type Status } from '@/design-system'

import { getLibelléInfoManquante } from '../getLibelléInfoManquante'

type RésultatApplicabilitéEither = Either.Either<
	RésultatApplicabilité,
	RéponseManquante[]
>

interface StatutApplicabilitéProps {
	résultat: RésultatApplicabilitéEither
}

export const StatutApplicabilité = ({ résultat }: StatutApplicabilitéProps) => {
	const { t } = useTranslation()

	const estApplicable = Either.isRight(résultat) && résultat.right.applicable
	const estNonApplicable =
		Either.isRight(résultat) && !résultat.right.applicable
	const estSousConditions = Either.isLeft(résultat)
	const conditionsManquantes = pipe(
		résultat,
		Either.getLeft,
		O.getOrElse((): RéponseManquante[] => [])
	)

	return (
		<SmallBody>
			{estApplicable && (
				<Strong>
					{t(
						'pages.simulateurs.location-de-logement-meublé.comparateur.applicable',
						'Applicable'
					)}
				</Strong>
			)}
			{estNonApplicable && (
				<Strong>
					{t(
						'pages.simulateurs.location-de-logement-meublé.comparateur.non-applicable',
						'Non applicable'
					)}
				</Strong>
			)}
			{estSousConditions && conditionsManquantes.length > 0 && (
				<>
					{t(
						'pages.simulateurs.location-de-logement-meublé.comparateur.indiquez',
						'Indiquez'
					)}{' '}
					{conditionsManquantes.map((condition, index) => (
						<span key={condition}>
							{index > 0 &&
								(index === conditionsManquantes.length - 1
									? t(
											'pages.simulateurs.location-de-logement-meublé.comparateur.et',
											' et '
										)
									: ', ')}
							<Strong>{getLibelléInfoManquante(t, condition)}</Strong>
						</span>
					))}{' '}
					{t(
						'pages.simulateurs.location-de-logement-meublé.comparateur.pour-savoir',
						'pour savoir si ce régime est applicable dans votre situation'
					)}
				</>
			)}
		</SmallBody>
	)
}

export const estApplicable = (résultat: RésultatApplicabilitéEither): boolean =>
	Either.isRight(résultat) && résultat.right.applicable

export const estNonApplicable = (
	résultat: RésultatApplicabilitéEither
): boolean => Either.isRight(résultat) && !résultat.right.applicable

export const estApplicableSurRecettesCourteDurée = (
	résultat: RésultatApplicabilitéEither
): boolean =>
	Either.isRight(résultat) &&
	résultat.right.applicable &&
	résultat.right.assiette.type === 'recettes-courte-durée'

export const getStatus = (résultat: RésultatApplicabilitéEither): Status => {
	if (Either.isLeft(résultat)) {
		return 'sousConditions'
	}

	return résultat.right.applicable ? 'applicable' : 'nonApplicable'
}
