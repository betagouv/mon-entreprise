import React from 'react'
import { Node, NodeValuePointer, formatNumber } from './common'
import { makeJsx } from '../evaluation'
import { Trans } from 'react-i18next'
import { trancheValue } from 'Engine/mecanisms/barème'
import './Barème.css'
import classNames from 'classnames'
import { ShowValuesConsumer } from 'Components/rule/ShowValuesContext'
import withLanguage from 'Components/utils/withLanguage'

export let BarèmeAttributes = ({ explanation }) => (
	<>
		<li key="assiette">
			<span className="key">
				<Trans>assiette</Trans>:{' '}
			</span>
			<span className="value">{makeJsx(explanation.assiette)}</span>
		</li>
		{explanation['multiplicateur'] &&
			explanation['multiplicateur'].nodeValue !== 1 && (
				<li key="multiplicateur">
					<span className="key">
						<Trans>multiplicateur</Trans>:{' '}
					</span>
					<span className="value">
						{makeJsx(explanation['multiplicateur'])}
					</span>
				</li>
			)}
	</>
)

let Component = withLanguage(function Barème({
	language,
	nodeValue,
	explanation,
	barèmeType
}) {
	return (
		<ShowValuesConsumer>
			{showValues => (
				<Node
					classes="mecanism barème"
					name={barèmeType === 'marginal' ? 'barème' : 'barème linéaire'}
					value={nodeValue}
					child={
						<ul className="properties">
							<BarèmeAttributes explanation={explanation} />
							<table className="tranches">
								<thead>
									<tr>
										<th>
											<Trans>Tranche de l&apos;assiette</Trans>
										</th>
										<th>
											<Trans>
												{explanation.tranches[0].taux != null
													? 'Taux'
													: 'Montant'}
											</Trans>
										</th>
										{showValues && explanation.tranches[0].taux != null && (
											<th>
												<Trans>Résultat</Trans>
											</th>
										)}
									</tr>
								</thead>
								<tbody>
									{explanation.tranches.map(tranche => (
										<Tranche
											key={tranche['de'] + tranche['à']}
											{...{
												language,
												tranche,
												showValues,
												trancheValue: trancheValue(barèmeType)(
													explanation['assiette'],
													explanation['multiplicateur']
												)(tranche)
											}}
										/>
									))}
								</tbody>
							</table>
							{showValues && barèmeType === 'marginal' && (
								<>
									<b>
										<Trans>Taux final</Trans> :{' '}
									</b>
									{formatNumber(
										(nodeValue / explanation['assiette'].nodeValue) * 100,
										language
									)}{' '}
									%
								</>
							)}
						</ul>
					}
				/>
			)}
		</ShowValuesConsumer>
	)
})

//eslint-disable-next-line
export default barèmeType => (nodeValue, explanation) => (
	<Component {...{ nodeValue, explanation, barèmeType }} />
)

let Tranche = ({
	tranche: {
		'en-dessous de': maxOnly,
		'au-dessus de': minOnly,
		de: min,
		à: max,
		taux,
		montant
	},
	trancheValue,
	showValues,
	language
}) => {
	let activated = trancheValue > 0
	return (
		<tr className={classNames('tranche', { activated })}>
			<td key="tranche">
				{maxOnly ? (
					<>
						<Trans>En-dessous de</Trans> {formatNumber(maxOnly, language)}
					</>
				) : minOnly ? (
					<>
						<Trans>Au-dessus de</Trans> {formatNumber(minOnly, language)}
					</>
				) : (
					<>
						<Trans>De</Trans> {formatNumber(min, language)} <Trans>à</Trans>{' '}
						{formatNumber(max, language)}
					</>
				)}
			</td>
			<td key="taux"> {taux != null ? makeJsx(taux) : montant}</td>
			{showValues && taux != null && (
				<td key="value">
					<NodeValuePointer data={trancheValue} />
				</td>
			)}
		</tr>
	)
}
