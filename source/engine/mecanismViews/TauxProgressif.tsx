import React from 'react'
import { BarèmeAttributes, TrancheTable } from './Barème'
import './Barème.css'
import { Node } from './common'

export default function TauxProgressif(nodeValue, explanation, _, unit) {
	return (
		<Node
			classes="mecanism barème"
			name="taux progressif"
			value={nodeValue}
			unit={unit}
			child={
				<ul className="properties">
					<BarèmeAttributes explanation={explanation} />
					<TrancheTable
						tranches={explanation.tranches}
						multiplicateur={explanation.multiplicateur}
					/>
				</ul>
			}
		/>
	)
}
