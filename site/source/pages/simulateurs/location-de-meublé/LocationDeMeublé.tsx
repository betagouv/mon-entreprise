import { Either, Match, pipe } from 'effect'
import { Trans } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'

import AvertissementDansObjectifDeSimulateur from '@/components/AvertissementDansObjectifDeSimulateur'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, { SimulationGoals } from '@/components/Simulation'
import {
	estSituationValide,
	PLAFOND_REGIME_GENERAL,
	SEUIL_PROFESSIONNALISATION,
	SimulationImpossible,
	SituationÉconomieCollaborative,
	usagerAChoisiUnRégimeDeCotisation,
	useEconomieCollaborative,
	ÉconomieCollaborativeProvider,
} from '@/contextes/économie-collaborative'
import { Button, SmallBody } from '@/design-system'
import { eurosParAn, toString as formatMontant } from '@/domaine/Montant'
import { ComparateurRégimesCards } from '@/pages/simulateurs/location-de-meublé/components/ComparateurRégimesCards'
import { ObjectifRecettes } from '@/pages/simulateurs/location-de-meublé/objectifs/ObjectifRecettes'
import { ObjectifRevenuNet } from '@/pages/simulateurs/location-de-meublé/objectifs/ObjectifRevenuNet'
import {
	AlsaceMoselleQuestion,
	PremiereAnneeQuestion,
	TypeLocationQuestion,
} from '@/pages/simulateurs/location-de-meublé/questions'
import { useSitePaths } from '@/sitePaths'

import { DocumentationHub } from './documentation'
import { ObjectifCotisations } from './objectifs/ObjectifCotisations'

const LocationDeMeublé = () => {
	const { situation, cotisations, revenuNet } = useEconomieCollaborative()
	const { absoluteSitePaths } = useSitePaths()

	const regimeCotisationChoisi = usagerAChoisiUnRégimeDeCotisation(situation)

	return (
		<>
			<Simulation<SituationÉconomieCollaborative>
				entrepriseSelection={false}
				situation={situation}
				questions={[
					TypeLocationQuestion,
					AlsaceMoselleQuestion,
					PremiereAnneeQuestion,
				]}
				showQuestionsFromBeginning={estSituationValide(situation)}
				avecQuestionsPublicodes={false}
			>
				<SimulateurWarning simulateur="location-de-logement-meublé" />
				<SimulationGoals>
					<ObjectifRecettes />
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
														<strong>{formatMontant(PLAFOND_REGIME_GENERAL)}</strong>
														) pour déclarer vos revenus de l'économie
														collaborative avec un statut social au régime
														général. Vous devez vous orienter vers les statuts
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
														<strong>{formatMontant(SEUIL_PROFESSIONNALISATION)}</strong>{' '}
														et votre activité n'est pas considérée comme
														professionnelle. Vous n'êtes pas obligé de vous
														affilier à la sécurité sociale. Vous pouvez
														toutefois le faire si vous souhaitez bénéficier
														d'une protection sociale (assurance maladie,
														retraite…) en contrepartie du paiement des
														cotisations sociales.
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
			{estSituationValide(situation) && <ComparateurRégimesCards />}
			<Button
				size="XS"
				light
				to={
					absoluteSitePaths.simulateurs['location-de-logement-meublé'] +
					'/documentation'
				}
			>
				📚 Documentation
			</Button>
		</>
	)
}

const LocationDeMeubléWithProvider = () => (
	<ÉconomieCollaborativeProvider>
		<Routes>
			<Route path="/documentation/*" element={<DocumentationHub />} />
			<Route path="/*" element={<LocationDeMeublé />} />
		</Routes>
	</ÉconomieCollaborativeProvider>
)

export default LocationDeMeubléWithProvider
