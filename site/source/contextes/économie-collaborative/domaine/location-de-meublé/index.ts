export type {
	SituationÉconomieCollaborative,
	SituationÉconomieCollaborativeValide,
	SituationMeubléDeTourisme,
	SituationMeubléDeTourismeValide,
	SituationChambreDHôte,
	SituationChambreDHôteValide,
	RegimeCotisation,
	TypeTourisme,
	TypeDurée,
} from './situation'
export { calculeCotisations } from './cotisations'
export { calculeCotisationsRégimeGénéral } from './régime-général'
export { calculeCotisationsMicroEntreprise } from './régime-micro-entreprise'
export { calculeCotisationsTravailleurIndépendant } from './régime-travailleur-indépendant'
export { calculeCotisationsPasDAffiliation } from './régime-pas-d-affiliation'
export {
	compareRégimes,
	type RésultatRégimeApplicable,
	type RésultatRégimeNonApplicable,
} from './comparateur-régimes'
