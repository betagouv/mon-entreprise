export { useEconomieCollaborative } from './hooks/useEconomieCollaborative'
export { ÉconomieCollaborativeProvider } from './hooks/EconomieCollaborativeContext'
export { isCotisationsEnabled } from './featureToggles'
export {
	aRenseignéSesAutresRevenus,
	simulationEstCommencée,
	estSituationValide,
	faitDeLaLocationCourteDurée,
	faitDeLaLocationCourteEtLongueDurée,
	RegimeCotisation,
	estSituationMeubléDeTourismeValide,
	type SituationÉconomieCollaborative,
	type SituationÉconomieCollaborativeValide,
	type SituationMeubléDeTourisme,
	type SituationMeubléDeTourismeValide,
	type SituationMeubléDeTourismeIncomplète,
	type SituationMeubléDuréeMixte,
	type SituationChambreDHôte,
	type TypeDurée,
	type Classement,
	type TypeHébergement,
	initialSituationMeubléDeTourisme,
	initialSituationChambreDHôte,
} from './domaine/location-de-meuble/situation'
export {
	type SimulationImpossible,
	RaisonInapplicabilité,
} from './domaine/location-de-meuble/erreurs'
export { SEUIL_PROFESSIONNALISATION } from './domaine/location-de-meuble/estActiviteProfessionnelle'
export {
	ABATTEMENT_REGIME_GENERAL,
	PLAFOND_REGIME_GENERAL,
	TAUX_COTISATION_RG_ALSACE_MOSELLE,
	TAUX_COTISATION_RG_NORMAL,
} from './domaine/location-de-meuble/regime-general'
export { RégimeTag } from './ui/RegimeTag'
export {
	compareRégimes,
	compareApplicabilitéDesRégimes,
	type RésultatRégimeApplicable,
	type RésultatRégimeNonApplicable,
	type RésultatApplicabilitéParRégime,
} from './domaine/location-de-meuble/comparateur-regimes'
export { estActiviteProfessionnelle } from './domaine/location-de-meuble/estActiviteProfessionnelle'
export { estActivitéPrincipale } from './domaine/location-de-meuble/estActivitePrincipale'
export { auMoinsUnRégimePotentiellementApplicable } from './domaine/location-de-meuble/auMoinsUnRegimePotentiellementApplicable'
export { estAffiliationObligatoire } from './domaine/location-de-meuble/estAffiliationObligatoire'
export type {
	RéponseManquante,
	RésultatApplicabilité,
} from './domaine/location-de-meuble/applicabilite'
