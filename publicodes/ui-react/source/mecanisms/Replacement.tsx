import { EvaluatedNode } from 'publicodes/source/AST/types'
import { VariationNode } from 'publicodes/source/mecanisms/variations'
import { useState } from 'react'
import Explanation from '../Explanation'
import Overlay from '../Overlay'
import { RuleLinkWithContext } from '../RuleLink'
import Variations from './Variations'

export default function Replacement(node: VariationNode & EvaluatedNode) {
	const applicableReplacement = node.explanation.find(
		(ex) => ex.satisfied
	)?.consequence
	const replacedNode = node.explanation.slice(-1)[0].consequence as {
		dottedName: string
	}

	const [displayReplacements, changeDisplayReplacement] = useState(false)
	return (
		<span>
			<Explanation node={applicableReplacement ?? replacedNode} />
			&nbsp;
			<button
				onClick={() => changeDisplayReplacement(true)}
				className="ui__ simple small button"
			>
				🔄
			</button>
			{displayReplacements && (
				<Overlay onClose={() => changeDisplayReplacement(false)}>
					<h3>Remplacement existant</h3>
					<p>
						Un ou plusieurs remplacements ciblent la règle{' '}
						<RuleLinkWithContext dottedName={replacedNode.dottedName} /> à cet
						endroit. Sa valeur est calculée selon la formule suivante :
					</p>

					<Variations {...node} />
					<div style={{ marginTop: '1rem' }} />
					<p>
						<a href="https://publi.codes/documentation/principes-de-base#remplacement">
							En savoir plus sur le remplacement dans publicodes
						</a>
					</p>
				</Overlay>
			)}
		</span>
	)
}
