import { ShowValuesConsumer } from 'Components/rule/ShowValuesContext'
import RuleLink from 'Components/RuleLink'
import { formatValue } from 'Engine/format'
import { sortObjectByKeys } from 'Engine/mecanismViews/common'
import { serialiseUnit } from 'Engine/units'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { BarèmeAttributes } from './Barème'
import './Barème.css'
import { Node, NodeValuePointer } from './common'

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
											<td key="tranche">
												<SeuilFormatteur
													value={Number(seuil)}
													unit={explanation.assiette.unit}
													multiplicateur={
														explanation.multiplicateur?.explanation
													}
												/>
											</td>
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
									<NodeValuePointer data={100 * explanation.taux} unit="%" />
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

function SeuilFormatteur({ value, multiplicateur, unit }) {
	const { language } = useTranslation().i18n
	if (value === 0) {
		return '0'
	} else {
		return (
			<>
				{formatValue({
					value,
					language
				})}{' '}
				{multiplicateur ? (
					<>
						&nbsp;
						<RuleLink {...multiplicateur} title={multiplicateur.name}>
							{multiplicateur.acronyme}
						</RuleLink>
						<NodeValuePointer
							data={value * multiplicateur.nodeValue}
							unit={multiplicateur.unit}
						/>
					</>
				) : (
					serialiseUnit(unit)
				)}{' '}
			</>
		)
	}
}

//eslint-disable-next-line
export default (nodeValue, explanation, _, unit) => (
	<Comp {...{ nodeValue, explanation, unit }} />
)
