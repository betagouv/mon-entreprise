export {
	annéeDeSimulation,
	annéeDesRevenus,
} from './domaine/annee-de-simulation'
export { joursDansAnnée } from './domaine/jours-affiliation'
export { FrontalierSuisseProvider } from './hooks/FrontalierSuisseContext'
export { useFrontalierSuisse } from './hooks/useFrontalierSuisse'
export {
	estSituationValide,
	initialSituationFrontalierSuisse,
	situationEstCommencée,
	type SituationFrontalierSuisse,
	type SituationFrontalierSuisseValide,
} from './domaine/situation'
export {
	abattementSécuritéSociale,
	calculeCotisationMaladie,
	décomposeCotisationMaladie,
	plafondSécuritéSociale,
	TAUX_ABATTEMENT_PASS,
	TAUX_COTISATION_MALADIE,
	type CotisationMaladie,
	type DécompositionCotisationMaladie,
} from './domaine/cotisation'
