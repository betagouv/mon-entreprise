import { Either, Match, pipe } from 'effect'
import { Trans } from 'react-i18next'

import AvertissementDansObjectifDeSimulateur from '@/components/AvertissementDansObjectifDeSimulateur'
import Value from '@/components/EngineValue/Value'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, { SimulationGoals } from '@/components/Simulation'
import { useEconomieCollaborative } from '@/contextes/économie-collaborative'
import { SimulationImpossible } from '@/contextes/économie-collaborative/domaine/location-de-meublé/erreurs'
import {
	SituationÉconomieCollaborative,
	usagerAChoisiUnRégimeDeCotisation,
} from '@/contextes/économie-collaborative/domaine/location-de-meublé/situation'
import { ÉconomieCollaborativeProvider } from '@/contextes/économie-collaborative/hooks/ÉconomieCollaborativeContext'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { eurosParAn } from '@/domaine/Montant'
import { ObjectifRecettes } from '@/pages/simulateurs/location-de-meublé/objectifs/ObjectifRecettes'
import { ObjectifRevenuNet } from '@/pages/simulateurs/location-de-meublé/objectifs/ObjectifRevenuNet'
import {
	AlsaceMoselleQuestion,
	PremiereAnneeQuestion,
	RegimeCotisationQuestion,
} from '@/pages/simulateurs/location-de-meublé/questions'

import { ObjectifCotisations } from './objectifs/ObjectifCotisations'

const LocationDeMeublé = () => {
	const { situation, cotisations, revenuNet } = useEconomieCollaborative()

	const regimeCotisationChoisi = usagerAChoisiUnRégimeDeCotisation(situation)

	return (
		<Simulation<SituationÉconomieCollaborative>
			entrepriseSelection={false}
			situation={situation}
			questions={[
				RegimeCotisationQuestion,
				AlsaceMoselleQuestion,
				PremiereAnneeQuestion,
			]}
			avecQuestionsPublicodes={false}
		>
			<SimulateurWarning simulateur="location-de-logement-meublé" />
			<SimulationGoals legend="Montant de votre loyer net">
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

const LocationDeMeubléWithProvider = () => (
	<ÉconomieCollaborativeProvider>
		<LocationDeMeublé />
	</ÉconomieCollaborativeProvider>
)

export default LocationDeMeubléWithProvider
