import { DottedName } from 'modele-social'
import { ASTNode, PublicodesExpression } from 'publicodes'

export type Situation = Partial<
	Record<DottedName, PublicodesExpression | ASTNode>
>
