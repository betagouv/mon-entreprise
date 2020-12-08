import Explanation from '../Explanation'
import { InfixMecanism, Mecanism } from './common'

export default function MecanismApplicable({ explanation }) {
	return (
		<InfixMecanism prefixed value={explanation.valeur}>
			<Mecanism name="applicable si" value={explanation.condition.nodeValue}>
				<Explanation node={explanation.condition} />
			</Mecanism>
			<br />
		</InfixMecanism>
	)
}
