import { ShowValuesConsumer } from 'Components/rule/ShowValuesContext'
import { sortObjectByKeys } from 'Engine/mecanismViews/common'
import React from 'react'
import { Trans } from 'react-i18next'
import { BarèmeAttributes } from './Barème'
import './Barème.css'
import { Node } from './common'

let Comp = function Barème({ nodeValue, explanation, unit }) {
	return (
		<ShowValuesConsumer>
			{showValues => (
				<Node
					classes="mecanism barème"
					name="barème continu"
					value={nodeValue}
					unit={unit}
					child={
						<ul className="properties">
							<BarèmeAttributes explanation={explanation} />
							<table className="tranches">
								<thead>
									<tr>
										<th>
											<Trans>Seuil</Trans>
										</th>
										<th>
											<Trans>Taux</Trans>
										</th>
									</tr>
								</thead>
								<tbody>
									{sortObjectByKeys(explanation.points).map(([seuil, taux]) => (
										<tr key={seuil} className="tranche">
											<td key="tranche">{seuil}</td>
											<td key="taux"> {taux}</td>
										</tr>
									))}
								</tbody>
							</table>
							{showValues && (
								<span style={{ background: 'yellow' }}>
									<b>
										<Trans>Votre taux </Trans> :{' '}
									</b>
									{(100 * explanation.taux).toFixed(2)} %
								</span>
							)}
							{explanation.returnRate && (
								<p>
									Ce barème <strong>ne retourne que le taux</strong>.
								</p>
							)}
						</ul>
					}
				/>
			)}
		</ShowValuesConsumer>
	)
}

//eslint-disable-next-line
export default (nodeValue, explanation, _, unit) => (
	<Comp {...{ nodeValue, explanation, unit }} />
)
