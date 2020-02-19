import React from 'react'
import { Trans } from 'react-i18next'
import { BarèmeAttributes, TrancheTable } from './Barème'
import './Barème.css'
import { Node, NodeValuePointer } from './common'

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
					{nodeValue != null && (
						<>
							<b>
								<Trans>Taux calculé</Trans> :{' '}
							</b>{' '}
							<NodeValuePointer data={nodeValue * 100} unit="%" />
						</>
					)}
				</ul>
			}
		/>
	)
}
