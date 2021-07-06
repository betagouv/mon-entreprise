import Explanation from '../Explanation'
import { InfixMecanism } from './common'

export default function MecanismArrondi({ explanation }) {
	return (
		<InfixMecanism value={explanation.valeur}>
			<p>
				<strong>Arrondi : </strong>
				<Explanation node={explanation.arrondi} />
			</p>
		</InfixMecanism>
	)
}
