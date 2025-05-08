import { Either, Match, Option, pipe } from 'effect'
import { DottedName } from 'modele-social'
import { useCallback, useEffect } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import AvertissementDansObjectifDeSimulateur from '@/components/AvertissementDansObjectifDeSimulateur'
import Value from '@/components/EngineValue/Value'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
	SituationStoreAdapter,
} from '@/components/Simulation'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { SimulationImpossible } from '@/domaine/économie-collaborative/location-de-meublé/erreurs'
import { SituationLocationCourteDuree } from '@/domaine/économie-collaborative/location-de-meublé/situation'
import { ValeurPublicodes } from '@/domaine/engine/RèglePublicodeAdapter'
import { eurosParAn } from '@/domaine/Montant'
import { RootState } from '@/store/reducers/rootReducer'
import {
	initialLocationDeMeubleState,
	setRecettesNumber,
	setSituation,
} from '@/store/slices/locationDeMeubleSlice'
import {
	activeLocationDeMeuble,
	selectLocationDeMeubleCotisations,
	selectLocationDeMeubleRevenuNet,
	selectLocationDeMeubleSituation,
} from '@/store/slices/simulateursSlice'

import { ObjectifCotisations } from './ObjectifCotisations'
import { ObjectifRevenuNet } from './ObjectifRevenuNet'
import {
	questionEstAlsaceMoselle,
	questionPremiereAnnee,
	questionRegimeCotisation,
} from './questions'

/**
 * Adaptateur pour connecter les questions au store de location meublée
 */
const locationMeubleAdapter: SituationStoreAdapter<SituationLocationCourteDuree> =
	{
		// Sélecteur retournant un Option de la situation
		selector: (state: RootState) => {
			const situation = selectLocationDeMeubleSituation(state)

			return situation ? Option.some(situation) : Option.none()
		},

		// Action creator pour mettre à jour la situation
		updateActionCreator: (situation: SituationLocationCourteDuree) =>
			setSituation(situation),
	}

export default function LocationDeMeublé() {
	const dispatch = useDispatch()

	useEffect(() => {
		// Active le simulateur de location meublée
		dispatch(activeLocationDeMeuble())

		// Initialise la situation avec les valeurs par défaut si elle n'existe pas déjà
		const locationMeubleSituation = selectLocationDeMeubleSituation({
			simulateurs: {
				locationDeMeuble: initialLocationDeMeubleState,
				meta: { simulateurActif: 'location-de-meuble' },
			},
		} as RootState)

		if (!locationMeubleSituation) {
			dispatch(setSituation(initialLocationDeMeubleState))
		}
	}, [dispatch])

	const handlePublicodeRecettesChange = useCallback(
		(_name: DottedName, value?: ValeurPublicodes) => {
			if (typeof value === 'object' && 'valeur' in value) {
				dispatch(setRecettesNumber(Number(value.valeur)))
			}
		},
		[dispatch]
	)

	const cotisations = useSelector(selectLocationDeMeubleCotisations)
	const revenuNet = useSelector(selectLocationDeMeubleRevenuNet)
	const situation = useSelector(selectLocationDeMeubleSituation)

	const regimeCotisationChoisi =
		situation?.regimeCotisation && Option.isSome(situation.regimeCotisation)

	return (
		<Simulation
			entrepriseSelection={false}
			questions={[
				questionRegimeCotisation,
				questionEstAlsaceMoselle,
				questionPremiereAnnee,
			]}
			situationAdapter={locationMeubleAdapter}
			avecQuestionsPublicodes={false}
		>
			<SimulateurWarning simulateur="location-de-logement-meublé" />
			<SimulationGoals legend="Montant de votre loyer net">
				<SimulationGoal
					dottedName="location de logement meublé . courte durée . recettes"
					displayedUnit="€/an"
					onUpdateSituation={handlePublicodeRecettesChange}
				/>

				{regimeCotisationChoisi &&
					Either.match(cotisations, {
						onRight: (cotisationsCalculées) => (
							<>
								<ObjectifCotisations cotisations={cotisationsCalculées} />
								<ObjectifRevenuNet
									revenuNet={pipe(
										revenuNet,
										Either.getOrElse(() => eurosParAn(0))
									)}
								/>
							</>
						),
						onLeft: (erreur) => {
							return pipe(
								erreur,
								Match.type<SimulationImpossible>().pipe(
									Match.tag(
										'RecettesSupérieuresAuPlafondAutoriséPourCeRégime',
										() => (
											<AvertissementDansObjectifDeSimulateur>
												<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.avertissement.dépassement-du-plafond">
													Vous dépassez le plafond autorisé (
													<Value
														linkToRule={false}
														expression="location de logement meublé . plafond régime général"
													/>
													) pour déclarer vos revenus de l'économie
													collaborative avec un statut social au régime général.
													Vous devez vous orienter vers les statuts
													d'auto-entrepreneur ou de travailleur indépendant.
												</Trans>
											</AvertissementDansObjectifDeSimulateur>
										)
									),
									Match.tag(
										'RecettesInférieuresAuSeuilRequisPourCeRégime',
										() => (
											<SmallBody>
												<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.avertissement.pas-de-cotisation">
													Le montant de vos recettes est inférieur à{' '}
													<Value expression="location de logement meublé . seuil de professionalisation" />{' '}
													et votre activité n'est pas considérée comme
													professionnelle. Vous n'êtes pas obligé de vous
													affilier à la sécurité sociale. Vous pouvez toutefois
													le faire si vous souhaitez bénéficier d'une protection
													sociale (assurance maladie, retraite…) en contrepartie
													du paiement des cotisations sociales.
												</Trans>
											</SmallBody>
										)
									),
									Match.tag('SituationIncomplète', () => null),
									Match.exhaustive
								)
							)
						},
					})}
			</SimulationGoals>
		</Simulation>
	)
}
