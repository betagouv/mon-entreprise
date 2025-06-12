export {
	estSalariéesValide,
	auMoinsUneSalariée,
	chaqueSalariéeAAuMoinsUneDéclaration,
	chaqueSalariéeAMAEstValide,
	chaqueSalariéeGEDEstValide,
} from './domaine/salariée'

export { CMGProvider } from './hooks/CMGContext'
export { useCMG } from './hooks/useCMG'
export type { Enfant, EnfantValide } from './domaine/enfant'
export {
	estEnfantsÀChargeValide,
	estEnfantGardable,
	tousLesEnfantsSontValides,
	pasDePrénomEndouble,
	estAeeHRépondue,
	estAeeHInférieurOuÉgalAuNombreDEnfants,
} from './domaine/enfant'
export type { SalariéeAMA, SalariéeGED } from './domaine/salariée'
export type {
	DéclarationDeGardeAMA,
	DéclarationDeGardeGED,
} from './domaine/déclaration-de-garde'
export { estInformationsValides } from './domaine/situation'
