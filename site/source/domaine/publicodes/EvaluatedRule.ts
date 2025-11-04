import { EvaluatedNode, RuleNode } from 'publicodes'

import { DottedName } from './DottedName'

export type EvaluatedRule = EvaluatedNode &
	RuleNode & { dottedName: DottedName }
