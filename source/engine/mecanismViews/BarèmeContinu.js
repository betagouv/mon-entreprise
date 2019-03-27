import React from 'react'
import { Node } from './common'
import { Trans } from 'react-i18next'
import './Barème.css'
import { ShowValuesConsumer } from 'Components/rule/ShowValuesContext'
import withLanguage from 'Components/utils/withLanguage'
import { BarèmeAttributes } from './Barème'
import { sortObjectByKeys } from 'Engine/mecanismViews/common'

let Comp = withLanguage(function Barème({ nodeValue, explanation }) {
	return (
		<ShowValuesConsumer>
			{showValues => (
				<Node
					classes="mecanism barème"
					name="barème continu"
					value={nodeValue}
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
})

//eslint-disable-next-line
export default (nodeValue, explanation) => (
	<Comp {...{ nodeValue, explanation }} />
)
