import Explanation from '../Explanation'
import { Mecanism } from './common'

export default function MecanismMinimum({ nodeValue, explanation, unit }) {
	return (
		<Mecanism name="le minimum de" value={nodeValue} unit={unit}>
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
