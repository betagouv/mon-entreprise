import Explanation from '../Explanation'
import { Mecanism } from './common'

export default function MecanismMaximum({ nodeValue, explanation, unit }) {
	return (
		<Mecanism name="le maximum de" value={nodeValue} unit={unit}>
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
