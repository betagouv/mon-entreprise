import React from 'react'
import { makeJsx } from '../evaluation'
import { Node } from './common'
import { Trans } from 'react-i18next'

export default function BarèmeLinéaire(nodeValue, explanation) {
	return (
		<Node
			classes="mecanism barèmeLinéaire"
			name="Barème linéaire"
			value={nodeValue}
			child={
				<ul className="properties">
					<li key="assiette">
						<span className="key">
							<Trans>assiette</Trans>:{' '}
						</span>
						<span className="value">{makeJsx(explanation.assiette)}</span>
					</li>
					<table className="tranches">
						<thead>
							<tr>
								<th>
									<Trans>Tranches</Trans>
								</th>
								<th>
									<Trans>Taux</Trans>
								</th>
							</tr>
							{explanation.tranches.map(
								({
									'en-dessous de': maxOnly,
									'au-dessus de': minOnly,
									de: min,
									à: max,
									taux
								}) => (
									<tr
										key={min || minOnly || 0}
										style={{
											fontWeight:
												Math.round(explanation.assiette.nodeValue) >= min &&
												(!max ||
													Math.round(explanation.assiette.nodeValue) <= max)
													? ' bold'
													: ''
										}}>
										<td key="tranche">
											{maxOnly
												? '< ' + maxOnly
												: minOnly
													? '> ' + minOnly
													: `${min} - ${max}`}
										</td>
										<td key="taux"> {makeJsx(taux)} </td>
									</tr>
								)
							)}
						</thead>
					</table>
				</ul>
			}
		/>
	)
}
