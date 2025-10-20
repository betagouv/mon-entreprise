import * as O from 'effect/Option'
import { ASTNode, EvaluatedNode, PublicodesExpression } from 'publicodes'

import { PublicodesAdapter } from '@/domaine/engine/PublicodesAdapter'

export const getStringOrNullFromPublicodesExpression = (
	value: PublicodesExpression | ASTNode | undefined
): string | null =>
	O.getOrNull(
		PublicodesAdapter.decode({ nodeValue: value } as EvaluatedNode)
	) as string
