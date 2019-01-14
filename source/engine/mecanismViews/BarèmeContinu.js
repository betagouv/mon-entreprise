import React from 'react'
import { Node, NodeValuePointer, formatNumber } from './common'
import { makeJsx } from '../evaluation'
import { Trans } from 'react-i18next'
import { trancheValue } from 'Engine/mecanisms/barème'
import './Barème.css'
import classNames from 'classnames'
import { ShowValuesConsumer } from 'Components/rule/ShowValuesContext'
import withLanguage from 'Components/utils/withLanguage'
import { BarèmeAttributes } from './Barème'
import { toPairs } from 'ramda'

let Comp = withLanguage(function Barème({ language, nodeValue, explanation }) {
	return (
		<ShowValuesConsumer>
			{showValues => (
				<Node
					classes="mecanism"
					name="barèmeContinu"
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
										{showValues && (
											<th>
												<Trans>Résultat</Trans>
											</th>
										)}
									</tr>
								</thead>
								<tbody>
									{toPairs(explanation.points).map(([seuil, taux]) => (
										<Point
											{...{
												language,
												seuil,
												taux,
												showValues
											}}
										/>
									))}
								</tbody>
							</table>
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

let Point = ({ seuil, taux, showValues, language }) => {
	return (
		<tr>
			<td key="tranche">{seuil}</td>
			<td key="taux"> {taux}</td>
		</tr>
	)
}
