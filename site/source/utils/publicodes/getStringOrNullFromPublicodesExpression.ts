import { pipe } from 'effect'
import * as O from 'effect/Option'
import { isString } from 'effect/String'
import { ASTNode, EvaluatedNode, PublicodesExpression } from 'publicodes'

import { PublicodesAdapter } from '@/domaine/engine/PublicodesAdapter'

export const getStringOrNullFromPublicodesExpression = (
	value: PublicodesExpression | ASTNode | undefined
): string | null =>
	pipe(
		PublicodesAdapter.decode({ nodeValue: value } as EvaluatedNode),
		O.map((value) => (isString(value) ? value : null)),
		O.getOrNull
	)
