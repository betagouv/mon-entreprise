import { VariationNode } from '../../mecanisms/variations'
import Explanation from '../Explanation'

export default function Replacement(node: VariationNode) {
	const applicableReplacement = node.explanation.find((ex) => ex.satisfied)
		?.consequence
	const replacedNode = node.explanation.slice(-1)[0].consequence
	return <Explanation node={applicableReplacement || replacedNode} />
}
