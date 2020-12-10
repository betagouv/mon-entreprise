import Explanation from '../Explanation'
import { InfixMecanism } from './common'

export default function MecanismSituation({ explanation }) {
	return explanation.situationValeur ? (
		<InfixMecanism prefixed value={explanation.valeur} dimValue>
			<p>
				<strong>Valeur renseignée dans la simulation : </strong>
				<Explanation node={explanation.situationValeur} />
			</p>
		</InfixMecanism>
	) : (
		<Explanation node={explanation.valeur} />
	)
}
