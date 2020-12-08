import Explanation from '../Explanation'
import { Mecanism } from './common'

export default function Allègement({ nodeValue, explanation }) {
	return (
		<div>
			<Mecanism name="allègement" value={nodeValue} unit={explanation.unit}>
				<ul className="properties">
					<li key="assiette">
						<span className="key">Assiette : </span>
						<span className="value">
							<Explanation node={explanation.assiette} />
						</span>
					</li>
					{!explanation.abattement?.isDefault && (
						<li key="abattement">
							<span className="key">Abattement : </span>
							<span className="value">
								<Explanation node={explanation.abattement} />
							</span>
						</li>
					)}
					{!explanation.plafond?.isDefault && (
						<li key="plafond">
							<span className="key">Plafond : </span>
							<span className="value">
								<Explanation node={explanation.plafond} />
							</span>
						</li>
					)}
				</ul>
			</Mecanism>
		</div>
	)
}
