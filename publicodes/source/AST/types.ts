import { ApplicableSiNode } from '../mecanisms/applicable'
import { ArrondiNode } from '../mecanisms/arrondi'
import { OperationNode } from '../mecanisms/operation'
import { BarèmeNode } from '../mecanisms/barème'
import { ReferenceNode } from '../reference'
import { RuleNode } from '../rule'
import { TouteCesConditionsNode } from '../mecanisms/condition-allof'
import { UneDeCesConditionsNode } from '../mecanisms/condition-oneof'
import { DuréeNode } from '../mecanisms/durée'
import { GrilleNode } from '../mecanisms/grille'
import { InversionNode } from '../mecanisms/inversion'
import { MaxNode } from '../mecanisms/max'
import { PlafondNode } from '../mecanisms/plafond'
import { MinNode } from '../mecanisms/min'
import { NonApplicableSiNode } from '../mecanisms/nonApplicable'
import { ParDéfautNode } from '../mecanisms/parDéfaut'
import { PlancherNode } from '../mecanisms/plancher'
import { ProductNode } from '../mecanisms/product'
import { RecalculNode } from '../mecanisms/recalcul'
import { ReductionNode } from '../mecanisms/reduction'
import { PossibilityNode } from '../mecanisms/one-possibility'
import { SituationNode } from '../mecanisms/situation'
import { SommeNode } from '../mecanisms/sum'
import { SynchronisationNode } from '../mecanisms/synchronisation'
import { TauxProgressifNode } from '../mecanisms/tauxProgressif'
import { UnitéNode } from '../mecanisms/unité'
import { VariableTemporelleNode } from '../mecanisms/variableTemporelle'
import { VariationNode } from '../mecanisms/variations'
import { ReplacementNode } from '../replacement'
import { Temporal } from '../temporal'

export type ConstantNode = {
	type: 'boolean' | 'objet' | 'number' | 'string'
	nodeValue: boolean | Object | number | string | null
	jsx: any
	nodeKind: 'constant'
	isDefault: boolean
}
export type ASTNode = (
	| RuleNode
	| ReferenceNode
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
	| ReductionNode
	| SituationNode
	| SommeNode
	| SynchronisationNode
	| TauxProgressifNode
	| UnitéNode
	| VariableTemporelleNode
	| VariationNode
	| ConstantNode
	| ReplacementNode
) & {
	isDefault?: boolean
	rawNode?: string | Object
} & (EvaluationDecoration<Types> | {}) // TODO : separate type for evaluated AST Tree

export type MecanismNode = Exclude<
	ASTNode,
	RuleNode | ConstantNode | ReferenceNode
>
export type NodeKind = ASTNode['nodeKind']
export type Value = ASTNode & {
	nodeValue: number | string | boolean
}

export type TraverseFunction<Kind extends NodeKind> = (
	fn: (n: ASTNode) => ASTNode,
	node: ASTNode & { nodeKind: Kind }
) => ASTNode & { nodeKind: Kind }

type BaseUnit = string

export type Unit = {
	numerators: Array<BaseUnit>
	denominators: Array<BaseUnit>
}

// Idée : une évaluation est un n-uple : (value, unit, missingVariable, isApplicable)
// Une temporalEvaluation est une liste d'evaluation sur chaque période. : [(Evaluation, Period)]
type EvaluationDecoration<T extends Types> = {
	nodeValue: Evaluation<T>
	missingVariables: Partial<Record<string, number>>
	unit?: Unit
	temporalValue?: Temporal<Evaluation>
}
export type Types = number | boolean | string | Object
export type Evaluation<T extends Types = Types> = T | false | null
export type EvaluatedNode<T extends Types = Types> = ASTNode &
	EvaluationDecoration<T>
