import Explanation from '../Explanation'
import { InfixMecanism } from './common'

export default function ParDéfautMecanism({ explanation }) {
	return (
		<InfixMecanism
			value={explanation.valeur}
			dimValue={explanation.valeur.nodeValue === null}
		>
			<p>
				<strong>Par défaut : </strong>
				<Explanation node={explanation.parDéfaut} />
			</p>
		</InfixMecanism>
	)
}
