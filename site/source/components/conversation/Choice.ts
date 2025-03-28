import { DottedName } from 'modele-social'
import { ASTNode } from 'publicodes'

export type Choice = ASTNode<'rule'> & {
	children: Array<
		| (ASTNode<'rule'> & {
				rawNode: ASTNode<'rule'>['rawNode'] & {
					estimation?: DottedName
				}
		  })
		| Choice
	>
	canGiveUp?: boolean
}
