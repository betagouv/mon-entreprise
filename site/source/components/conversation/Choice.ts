import { ASTNode } from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'

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

export const isChoice = (
	choiceChild:
		| (ASTNode<'rule'> & {
				rawNode: ASTNode<'rule'>['rawNode'] & {
					estimation?: DottedName
				}
		  })
		| Choice
): choiceChild is Choice => Object.hasOwn(choiceChild, 'children')
