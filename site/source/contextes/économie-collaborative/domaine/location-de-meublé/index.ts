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
export { calculeCotisationsRégimeGénéral } from './régime-général'
export { calculeCotisationsMicroEntreprise } from './régime-micro-entreprise'
export { calculeCotisationsSécuritéSocialeDesIndépendants } from './régime-sécurité-sociale-indépendants'
export {
	compareRégimes,
	type RésultatRégimeApplicable,
	type RésultatRégimeNonApplicable,
} from './comparateur-régimes'
