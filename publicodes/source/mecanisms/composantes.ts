import { dissoc, omit, pick } from 'ramda'
import Composantes from '../components/mecanisms/Composantes'
import { ASTNode } from '../AST/types'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'

export const decompose = (k, v, context): ASTNode => {
	const { composantes, ...factoredKeys } = v
	const explanation = parse(
		{
			somme: composantes.map((composante) => {
				const { attributs, ...otherKeys } = composante
				return {
					...attributs,
					[k]: {
						...factoredKeys,
						...otherKeys,
					},
				}
			}),
		},
		context
	)
	return {
		...explanation,
		jsx: Composantes,
	}
}
