import { Either, Option } from 'effect'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { ObjectifDeSimulation } from '@/components/Simulation/ObjectifDeSimulation'
import { SEUIL_PROFESSIONNALISATION } from '@/domaine/économie-collaborative/location-de-meublé/constantes'
import { calculeCotisations } from '@/domaine/économie-collaborative/location-de-meublé/cotisations'
import { SituationIncomplète } from '@/domaine/économie-collaborative/location-de-meublé/erreurs'
import { Montant } from '@/domaine/Montant'
import {
	selectEstLocationDeMeubleActif,
	selectLocationDeMeubleSituation,
} from '@/store/slices/simulateursSlice'

export function ObjectifCotisations() {
	const { t } = useTranslation()

	const estActif = useSelector(selectEstLocationDeMeubleActif)
	const situation = useSelector(selectLocationDeMeubleSituation)

	if (!estActif || !situation) {
		return null
	}

	const valeurMontant = Either.match(calculeCotisations(situation), {
		onRight: (montant) => Option.some(montant),
		onLeft: () => Option.none<Montant>(),
	})

	const messageComplementaire = Option.match(valeurMontant, {
		onSome: (montant) =>
			montant.valeur === 0
				? t(
						'pages.simulateurs.location-de-logement-meublé.avertissement.pas-de-cotisation',
						`Le montant de vos recettes est inférieur à ${SEUIL_PROFESSIONNALISATION.valeur} € et votre activité n'est pas considérée comme professionnelle.
						Vous n'êtes pas obligé de vous affilier à la sécurité sociale.
						Vous pouvez toutefois le faire si vous souhaitez bénéficier d'une protection sociale (assurance maladie, retraite…) en contrepartie du paiement des cotisations sociales.`
				  )
				: undefined,
		onNone: () => {
			const resultat = calculeCotisations(situation)

			return Either.match(resultat, {
				onRight: () => undefined,
				onLeft: (erreur) => {
					if (erreur instanceof SituationIncomplète) {
						return t(
							'pages.simulateurs.location-de-logement-meublé.erreurs.situation-incomplète',
							'Saisissez les recettes'
						)
					}

					return erreur.toString()
				},
			})
		},
	})

	return (
		<ObjectifDeSimulation
			id="objectif-location-meuble-cotisations"
			titre={t(
				'pages.simulateurs.location-de-logement-meublé.objectifs.cotisations',
				'Cotisations sociales'
			)}
			valeur={valeurMontant}
			messageComplementaire={messageComplementaire}
			isInfoMode={false}
		/>
	)
}
