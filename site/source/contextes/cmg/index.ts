export {
	estSalariéesValide,
	auMoinsUneSalariée,
	chaqueSalariéeAAuMoinsUneDéclaration,
	chaqueSalariéeAMAEstValide,
	chaqueSalariéeGEDEstValide,
} from './domaine/salariee'

export { CMGProvider } from './hooks/CMGContext'
export { useCMG } from './hooks/useCMG'
export type { Enfant, EnfantValide } from './domaine/enfant'
export type { Mois } from './domaine/Mois'
export {
	estEnfantsÀChargeValide,
	estEnfantGardable,
	tousLesEnfantsSontValides,
	pasDePrénomEndouble,
	estAeeHRépondue,
	estAeeHInférieurOuÉgalAuNombreDEnfants,
} from './domaine/enfant'
export type { SalariéeAMA, SalariéeGED } from './domaine/salariee'
export type {
	DéclarationDeGardeAMA,
	DéclarationDeGardeGED,
} from './domaine/declaration-de-garde'
export { estInformationsValides } from './domaine/situation'
