import React from 'react'
import { Node, NodeValuePointer, formatNumber } from './common'
import { makeJsx } from '../evaluation'
import { Trans } from 'react-i18next'
import { trancheValue } from 'Engine/mecanisms/barème'
import './Barème.css'
import classNames from 'classnames'
import { ShowValuesConsumer } from 'Components/rule/ShowValuesContext'
import withLanguage from 'Components/utils/withLanguage'
import { identity } from 'ramda'

export let BarèmeAttributes = ({ explanation, lazyEval = identity }) => (
	<>
		<li key="assiette">
			<span className="key">
				<Trans>assiette</Trans>:{' '}
			</span>
			<span className="value">{makeJsx(lazyEval(explanation.assiette))}</span>
		</li>
		{explanation['multiplicateur'] &&
			explanation['multiplicateur'].nodeValue !== 1 && (
				<li key="multiplicateur">
					<span className="key">
						<Trans>multiplicateur</Trans>:{' '}
					</span>
					<span className="value">
						{makeJsx(lazyEval(explanation['multiplicateur']))}
					</span>
				</li>
			)}
	</>
)

let Component = withLanguage(function Barème({
	language,
	nodeValue,
	explanation,
	barèmeType,
	lazyEval
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
							<BarèmeAttributes explanation={explanation} lazyEval={lazyEval} />
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
												trancheValue:
													barèmeType === 'marginal'
														? tranche.value
														: trancheValue(
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
										(nodeValue / lazyEval(explanation['assiette']).nodeValue) *
											100,
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

//eslint-disable-next-line
export default barèmeType => (nodeValue, explanation, lazyEval = identity) => (
	<Component {...{ nodeValue, explanation, barèmeType, lazyEval }} />
)
