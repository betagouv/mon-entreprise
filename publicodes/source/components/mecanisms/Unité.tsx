import Explanation from '../Explanation'
import { InfixMecanism } from './common'
import { serializeUnit } from '../../units'

export default function MecanismUnité(node) {
	return node.explanation.nodeKind === 'constant' ||
		node.explanation.nodeKind === 'reference' ? (
		<>
			<Explanation node={node.explanation} />
			&nbsp;{serializeUnit(node.unit)}
		</>
	) : (
		<>
			<InfixMecanism value={node.explanation}>
				<p>
					<strong>Unité : </strong>
					{serializeUnit(node.unit)}
				</p>
			</InfixMecanism>
		</>
	)
}
