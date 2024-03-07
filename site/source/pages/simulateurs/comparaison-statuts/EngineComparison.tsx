import { NamedEngine } from '@/pages/simulateurs/comparaison-statuts/NamedEngine'

export type EngineComparison =
	| [NamedEngine, NamedEngine, NamedEngine]
	| [NamedEngine, NamedEngine]
