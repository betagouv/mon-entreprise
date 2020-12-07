import { capitalise0 } from '../../utils'
import Explanation from '../Explanation'

export default function RuleMecanism({ rawNode, explanation }) {
	return (
		<>
			<code className="ui__ light-bg">{capitalise0(rawNode.nom)}</code>
			&nbsp;
			<Explanation node={explanation.valeur} />
		</>
	)
}
