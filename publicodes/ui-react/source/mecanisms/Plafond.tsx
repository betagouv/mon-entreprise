import Explanation from '../Explanation'
import { InfixMecanism } from './common'

export default function MecanismPlafond({ explanation }) {
	return (
		<InfixMecanism value={explanation.valeur}>
			<p
				style={
					explanation.plafond.isActive
						? { background: 'var(--lighterColor)', fontWeight: 'bold' }
						: {}
				}
			>
				<strong>Plafonné à : </strong>
				<Explanation node={explanation.plafond} />
			</p>
		</InfixMecanism>
	)
}
