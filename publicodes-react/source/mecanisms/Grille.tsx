import React from 'react'
import { BarèmeAttributes, TrancheTable, StyledComponent } from './Barème'
import { Mecanism } from './common'

export default function Grille({ nodeValue, explanation, unit }) {
	return (
		<StyledComponent>
			<Mecanism name="grille" value={nodeValue} unit={unit}>
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
