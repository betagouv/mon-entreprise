export { ComparateurProvider } from './hooks/ComparaisonStatutsContext'
export { useComparateur } from './hooks/useComparateur'
export { type NatureActivité } from './domaine/activite'
export { type IRouIS } from './domaine/imposition'
export { ModèleAssimiléSalarié } from './domaine/ModeleAssimileSalarie'
export { ModèleAutoEntrepreneur } from './domaine/ModeleAutoEntrepreneur'
export { ModèleTravailleurIndépendant } from './domaine/ModeleTravailleurIndependant'
export {
	estSituationValide,
	initialSituationComparée,
	simulationEstCommencée,
	type SituationComparée,
	type SituationComparéeValide,
} from './domaine/situation'
export {
	type ÉlémentComparé,
	type MontantDocumenté,
	type MontantRécurrentDocumenté,
	type QuantitéDocumentée,
} from './domaine/modeleComparable'
