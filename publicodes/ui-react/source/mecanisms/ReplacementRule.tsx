import { ReplacementRule } from 'publicodes/source/replacement'
import Explanation from '../Explanation'

export default function ReplacementMecanism(node: ReplacementRule) {
	return (
		<span>
			Remplace <Explanation node={node.replacedReference} />{' '}
			{node.rawNode.par && (
				<>
					par <Explanation node={node.replacementNode} />
				</>
			)}
			{node.rawNode.dans && (
				<>
					dans{' '}
					{node.whiteListedNames.map((child, i) => [
						i > 0 && ', ',
						<Explanation key={i} node={child} />,
					])}
				</>
			)}
			{node.rawNode['sauf dans'] && (
				<>
					sauf dans{' '}
					{node.blackListedNames.map((child, i) => [
						i > 0 && ', ',
						<Explanation key={i} node={child} />,
					])}
				</>
			)}
		</span>
	)
}
