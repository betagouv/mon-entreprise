import { DottedName } from 'modele-social'
import { ASTNode, PublicodesExpression } from 'publicodes'

export type SituationPublicodes = Partial<
	Record<DottedName, PublicodesExpression | ASTNode>
>
