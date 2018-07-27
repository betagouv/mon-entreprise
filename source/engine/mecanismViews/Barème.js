import React from 'react'
import { Node } from './common'
import { makeJsx } from '../evaluation'
import { Trans } from 'react-i18next'

export default function Barème(nodeValue, explanation) {
	return (
		<Node
			classes="mecanism barème"
			name="barème"
			value={nodeValue}
			child={
				<ul className="properties">
					<li key="assiette">
						<span className="key">
							<Trans>assiette</Trans>:{' '}
						</span>
						<span className="value">{makeJsx(explanation.assiette)}</span>
					</li>
					<li key="multiplicateur">
						<span className="key">
							<Trans>multiplicateur des tranches</Trans>:{' '}
						</span>
						<span className="value">
							{makeJsx(explanation['multiplicateur des tranches'])}
						</span>
					</li>
					<table className="tranches">
						<thead>
							<tr>
								<th>
									<Trans>Tranches de l&apos;assiette</Trans>
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
												explanation.assiette.nodeValue >
													explanation['multiplicateur des tranches'].nodeValue *
														min &&
												max &&
												explanation.assiette.nodeValue <
													explanation['multiplicateur des tranches'].nodeValue *
														max
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
