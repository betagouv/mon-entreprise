export { useEconomieCollaborative } from './hooks/useEconomieCollaborative'
export { ÉconomieCollaborativeProvider } from './hooks/ÉconomieCollaborativeContext'
export { isCotisationsEnabled } from './featureToggles'
export {
	estSituationValide,
	faitDeLaLocationCourteDurée,
	faitDeLaLocationCourteEtLongueDurée,
	RegimeCotisation,
	estSituationMeubléDeTourismeValide,
	type SituationÉconomieCollaborative,
	type SituationÉconomieCollaborativeValide,
	type SituationMeubléDeTourisme,
	type SituationMeubléDeTourismeValide,
	type SituationChambreDHôte,
	type TypeDurée,
	type Classement,
	type TypeHébergement,
	initialSituationMeubléDeTourisme,
	initialSituationChambreDHôte,
} from './domaine/location-de-meublé/situation'
export {
	type SimulationImpossible,
	RaisonInapplicabilité,
} from './domaine/location-de-meublé/erreurs'
export { SEUIL_PROFESSIONNALISATION } from './domaine/location-de-meublé/estActiviteProfessionnelle'
export {
	ABATTEMENT_REGIME_GENERAL,
	PLAFOND_REGIME_GENERAL,
	TAUX_COTISATION_RG_ALSACE_MOSELLE,
	TAUX_COTISATION_RG_NORMAL,
} from './domaine/location-de-meublé/régime-général'
export { RégimeTag } from './ui/RégimeTag'
export {
	compareRégimes,
	type RésultatRégimeApplicable,
	type RésultatRégimeNonApplicable,
} from './domaine/location-de-meublé/comparateur-régimes'
export { estActiviteProfessionnelle } from './domaine/location-de-meublé/estActiviteProfessionnelle'
