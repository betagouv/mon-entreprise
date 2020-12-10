import { capitalise0 } from '../../utils'
import Explanation from '../Explanation'

export default function RuleMecanism({ rawNode, explanation }) {
	return (
		<div
			css={`
				display: flex;
				flex-direction: column;
			`}
		>
			<code
				className="ui__ light-bg"
				css={`
					align-self: flex-start;
					margin: 0;
					margin-bottom: 0.2rem;
				`}
			>
				{capitalise0(rawNode.nom)}
			</code>
			<Explanation node={explanation.valeur} />
		</div>
	)
}
