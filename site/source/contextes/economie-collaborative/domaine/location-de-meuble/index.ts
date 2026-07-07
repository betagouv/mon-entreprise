export type {
	SituationÉconomieCollaborative,
	SituationÉconomieCollaborativeValide,
	SituationMeubléDeTourisme,
	SituationMeubléDeTourismeValide,
	SituationChambreDHôte,
	SituationChambreDHôteValide,
	RegimeCotisation,
	Classement,
	TypeDurée,
} from './situation'
export { calculeCotisations } from './cotisations'
export { calculeCotisationsRégimeGénéral } from './regime-general'
export { calculeCotisationsMicroEntreprise } from './regime-micro-entreprise'
export { calculeCotisationsSécuritéSocialeDesIndépendants } from './regime-securite-sociale-independants'
export {
	compareRégimes,
	type RésultatRégimeApplicable,
	type RésultatRégimeNonApplicable,
} from './comparateur-regimes'
