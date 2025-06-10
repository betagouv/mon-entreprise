export { CMGProvider } from './hooks/CMGContext'
export { useCMG } from './hooks/useCMG'
export type { Enfant, EnfantValide } from './domaine/enfant'
export { estEnfantsÀChargeValide, estEnfantGardable } from './domaine/enfant'
export type { SalariéeAMA, SalariéeGED } from './domaine/salariée'
export type {
	DéclarationDeGardeAMA,
	DéclarationDeGardeGED,
} from './domaine/déclaration-de-garde'
export type { RaisonInéligibilité } from './domaine/éligibilité'
export {
	estInformationsValides,
	estModesDeGardeValide,
} from './domaine/situation'
