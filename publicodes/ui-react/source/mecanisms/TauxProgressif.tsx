import { BarèmeAttributes, StyledComponent, TrancheTable } from './Barème'
import { Mecanism } from './common'

export default function TauxProgressif({ nodeValue, explanation, unit }) {
	return (
		<StyledComponent>
			<Mecanism name="taux progressif" value={nodeValue} unit={unit}>
				<ul className="properties">
					<BarèmeAttributes explanation={explanation} />
					<TrancheTable
						tranches={explanation.tranches}
						multiplicateur={explanation.multiplicateur}
					/>
				</ul>
			</Mecanism>
		</StyledComponent>
	)
}
