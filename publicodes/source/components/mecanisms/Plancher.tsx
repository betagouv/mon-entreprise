import Explanation from '../Explanation'
import { InfixMecanism } from './common'

export default function MecanismPlancher({ explanation }) {
	return (
		<InfixMecanism value={explanation.valeur}>
			<p
				style={
					explanation.plancher.isActive
						? { background: 'var(--lighterColor)', fontWeight: 'bold' }
						: {}
				}
			>
				<strong>Minimum : </strong>
				<Explanation node={explanation.plancher} />
			</p>
		</InfixMecanism>
	)
}
