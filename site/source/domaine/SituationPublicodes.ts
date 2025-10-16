import { ASTNode, PublicodesExpression } from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'

export type SituationPublicodes = Partial<
	Record<DottedName, PublicodesExpression | ASTNode>
>
