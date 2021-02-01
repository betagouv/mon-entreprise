import Explanation from '../Explanation'
import { Mecanism } from './common'

export default function Abattement({ nodeValue, unit, explanation }) {
	return (
		<div>
			<Mecanism name="Abattement" value={nodeValue} unit={unit}>
				<ul className="properties">
					<li key="assiette">
						<span className="key">Assiette : </span>
						<span className="value">
							<Explanation node={explanation.assiette} />
						</span>
					</li>

					<li key="abattement">
						<span className="key">Abattement : </span>
						<span className="value">
							<Explanation node={explanation.abattement} />
						</span>
					</li>
				</ul>
			</Mecanism>
		</div>
	)
}
