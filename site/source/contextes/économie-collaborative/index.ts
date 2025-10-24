export { useEconomieCollaborative } from './hooks/useEconomieCollaborative'
export { ÉconomieCollaborativeProvider } from './hooks/ÉconomieCollaborativeContext'
export { isCotisationsEnabled } from './featureToggles'
export {
	estSituationValide,
	RegimeCotisation,
	type SituationÉconomieCollaborative,
	type TypeLocation,
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
