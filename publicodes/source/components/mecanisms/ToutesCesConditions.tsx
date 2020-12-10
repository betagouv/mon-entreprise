import Explanation from '../Explanation'
import { Mecanism } from './common'

export default function ToutesCesConditionsMecanism({
	nodeValue,
	explanation,
	unit,
}) {
	return (
		<Mecanism name="toutes ces conditions" value={nodeValue} unit={unit}>
			<ul>
				{explanation.map((item, i) => (
					<li key={i}>
						<Explanation node={item} />
					</li>
				))}
			</ul>
		</Mecanism>
	)
}
