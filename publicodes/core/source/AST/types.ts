import { AbattementNode } from '../mecanisms/abattement'
import { ApplicableSiNode } from '../mecanisms/applicable'
import { ArrondiNode } from '../mecanisms/arrondi'
import { BarèmeNode } from '../mecanisms/barème'
import { TouteCesConditionsNode } from '../mecanisms/condition-allof'
import { UneDeCesConditionsNode } from '../mecanisms/condition-oneof'
import { DuréeNode } from '../mecanisms/durée'
import { GrilleNode } from '../mecanisms/grille'
import { InversionNode } from '../mecanisms/inversion'
import { MaxNode } from '../mecanisms/max'
import { MinNode } from '../mecanisms/min'
import { NonApplicableSiNode } from '../mecanisms/nonApplicable'
import { PossibilityNode } from '../mecanisms/one-possibility'
import { OperationNode } from '../mecanisms/operation'
import { ParDéfautNode } from '../mecanisms/parDéfaut'
import { PlafondNode } from '../mecanisms/plafond'
import { PlancherNode } from '../mecanisms/plancher'
import { ProductNode } from '../mecanisms/product'
import { RecalculNode } from '../mecanisms/recalcul'
import { RésoudreRéférenceCirculaireNode } from '../mecanisms/résoudre-référence-circulaire'
import { SituationNode } from '../mecanisms/situation'
import { SommeNode } from '../mecanisms/sum'
import { SynchronisationNode } from '../mecanisms/synchronisation'
import { TauxProgressifNode } from '../mecanisms/tauxProgressif'
import { UnitéNode } from '../mecanisms/unité'
import { VariationNode } from '../mecanisms/variations'
import { ReferenceNode } from '../reference'
import { ReplacementRule } from '../replacement'
import { RuleNode } from '../rule'

export type ConstantNode = {
	type: 'boolean' | 'objet' | 'number' | 'string'
	nodeValue: Evaluation
	nodeKind: 'constant'
	isDefault?: boolean
}
export type ASTNode = (
	| RuleNode
	| ReferenceNode
	| AbattementNode
	| ApplicableSiNode
	| ArrondiNode
	| BarèmeNode
	| TouteCesConditionsNode
	| UneDeCesConditionsNode
	| DuréeNode
	| GrilleNode
	| MaxNode
	| InversionNode
	| MinNode
	| NonApplicableSiNode
	| OperationNode
	| ParDéfautNode
	| PossibilityNode
	| PlafondNode
	| PlancherNode
	| ProductNode
	| RecalculNode
	| RésoudreRéférenceCirculaireNode
	| SituationNode
	| SommeNode
	| SynchronisationNode
	| TauxProgressifNode
	| UnitéNode
	| VariationNode
	| ConstantNode
	| ReplacementRule
) & {
	isDefault?: boolean
	visualisationKind?: string
	rawNode?: string | Record<string, unknown>
} & (
		| EvaluationDecoration<Types>
		// We remove the ESLINT warning as it does not concern intersection type and is actually useful here
		// https://github.com/typescript-eslint/typescript-eslint/issues/2063#issuecomment-675156492
		// eslint-disable-next-line @typescript-eslint/ban-types
		| {}
	)
// TODO : separate type for evaluated AST Tree

export type MecanismNode = Exclude<
	ASTNode,
	RuleNode | ConstantNode | ReferenceNode
>

export type ASTTransformer = (n: ASTNode) => ASTNode
export type ASTVisitor = (n: ASTNode) => void

export type NodeKind = ASTNode['nodeKind']
export type TraverseFunction<Kind extends NodeKind> = (
	fn: ASTTransformer,
	node: ASTNode & { nodeKind: Kind }
) => ASTNode & { nodeKind: Kind }

type BaseUnit = string

// TODO: I believe it would be more effecient (for unit conversion and for
// inference), and more general to represent units using a map of base unit to
// their power number :
//
// type Unit = Map<BaseUnit, number>
// N.m²/kg² <-> {N: 1, m: 2, kg: -2} (gravity constant)
export type Unit = {
	numerators: Array<BaseUnit>
	denominators: Array<BaseUnit>
}

// Idée : une évaluation est un n-uple : (value, unit, missingVariable, isApplicable)
type EvaluationDecoration<T extends Types> = {
	nodeValue: Evaluation<T>
	missingVariables: Record<string, number>
	unit?: Unit
}
export type Types = number | boolean | string | Record<string, unknown>
// TODO: type NotYetDefined & NotApplicable properly (see #14) then refactor any code depending on these:
export type NotYetDefined = null
export function isNotYetDefined(value): value is NotYetDefined {
	return value === null
}
export type NotApplicable = false
export function isNotApplicable(value): value is NotApplicable {
	return typeof value === 'boolean' && value === false
}
export type Evaluation<T extends Types = Types> =
	| T
	| NotApplicable
	| NotYetDefined
export type EvaluatedNode<T extends Types = Types> = ASTNode &
	EvaluationDecoration<T>
