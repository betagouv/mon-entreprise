import { Either, Option } from 'effect'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { ObjectifDeSimulation } from '@/components/Simulation/ObjectifDeSimulation'
import { calculeRevenuNet } from '@/domaine/économie-collaborative/location-de-meublé/revenu-net'
import { estSituationValide } from '@/domaine/économie-collaborative/location-de-meublé/situation'
import { Montant } from '@/domaine/Montant'
import {
	selectEstLocationDeMeubleActif,
	selectLocationDeMeubleSituation,
} from '@/store/slices/simulateursSlice'

export function ObjectifRevenuNet() {
	const { t } = useTranslation()

	const estActif = useSelector(selectEstLocationDeMeubleActif)
	const situation = useSelector(selectLocationDeMeubleSituation)

	if (!estActif || !situation) {
		return null
	}

	const valeurMontant = !estSituationValide(situation)
		? Option.none<Montant>()
		: Either.match(calculeRevenuNet(situation), {
				onRight: (revenuNet) => Option.some(revenuNet),
				onLeft: () => Option.none<Montant>(),
		  })

	const messageComplementaire = !estSituationValide(situation)
		? t(
				'pages.simulateurs.location-de-logement-meublé.erreurs.situation-incomplète',
				'Saisissez les recettes'
		  )
		: Option.match(valeurMontant, {
				onSome: () => undefined,
				onNone: () => {
					const resultat = calculeRevenuNet(situation)

					return Either.match(resultat, {
						onRight: () => undefined,
						onLeft: (erreur) => erreur.toString(),
					})
				},
		  })

	return (
		<ObjectifDeSimulation
			id="objectif-location-meuble-revenu-net"
			titre={t(
				'pages.simulateurs.location-de-logement-meublé.objectifs.revenu-net',
				'Revenu net (nouveau calcul)'
			)}
			valeur={valeurMontant}
			messageComplementaire={messageComplementaire}
			isInfoMode={true}
		/>
	)
}
