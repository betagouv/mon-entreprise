import React from 'react'
import { BarèmeAttributes, TrancheTable } from './Barème'
import './Barème.css'
import { Node } from './common'

export default function Grille({ nodeValue, explanation, unit }) {
	return (
		<Node classes="mecanism barème" name="grille" value={nodeValue} unit={unit}>
			<ul className="properties">
				<BarèmeAttributes explanation={explanation} />
				<TrancheTable
					tranches={explanation.tranches}
					multiplicateur={explanation.multiplicateur}
				/>
			</ul>
		</Node>
	)
}
