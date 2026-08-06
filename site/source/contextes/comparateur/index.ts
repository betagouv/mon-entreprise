export { ComparateurProvider } from './hooks/ComparaisonStatutsContext'
export { useComparateur } from './hooks/useComparateur'
export { type NatureActivité, type TypeActivité } from './domaine/activite'
export {
	type IRouIS,
	type MéthodeImposition,
	type SituationFamiliale,
} from './domaine/imposition'
export { ModèleAssimiléSalarié } from './domaine/ModeleAssimileSalarie'
export { ModèleAutoEntrepreneur } from './domaine/ModeleAutoEntrepreneur'
export { ModèleTravailleurIndépendant } from './domaine/ModeleTravailleurIndependant'
export {
	estSituationValide,
	initialSituationComparée,
	simulationEstCommencée,
	type SituationComparée,
} from './domaine/situation'
export {
	type ÉlémentComparé,
	type MontantDocumenté,
	type MontantRécurrentDocumenté,
	type QuantitéDocumentée,
} from './domaine/modeleComparable'
