import Explanation from '../Explanation'
import { Mecanism } from './common'

export default function MecanismDurée({ nodeValue, explanation, unit }) {
	return (
		<Mecanism name="durée" value={nodeValue} unit={unit}>
			<>
				<p>
					<strong className="key">Depuis : </strong>
					<span className="value">
						<Explanation node={explanation.depuis} />
					</span>
				</p>
				<p>
					<strong className="key">Jusqu'à : </strong>
					<span className="value">
						<Explanation node={explanation["jusqu'à"]} />
					</span>
				</p>
			</>
		</Mecanism>
	)
}
