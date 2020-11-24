import { ASTNode } from '../AST/types'
import { Mecanism } from '../components/mecanisms/common'
import { makeJsx } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'
import { Context } from '../parsePublicodes'

export type PossibilityNode = {
	explanation: Array<ASTNode>
	'choix obligatoire'?: 'oui'
	context: string
	jsx: any
	nodeKind: 'une possibilité'
}
// TODO : This isn't a real mecanism, cf. #963
export const mecanismOnePossibility = (v, context: Context) => {
	if (Array.isArray(v)) {
		v = {
			possibilités: v
		}
	}
	return {
		...v,
		explanation: v.possibilités.map(p => parse(p, context)),
		nodeKind: 'une possibilité',
		jsx: (node: PossibilityNode) => (
			<Mecanism name="une possibilité parmis" value={null}>
				<ul>
					{node.explanation.map(node => (
						<li>{makeJsx(node)}</li>
					))}
				</ul>
			</Mecanism>
		),
		context: context.dottedName
	} as PossibilityNode
}
registerEvaluationFunction<'une possibilité'>('une possibilité', node => ({
	...node,
	nodeValue: null,
	missingVariables: { [node.context]: 1 }
}))
