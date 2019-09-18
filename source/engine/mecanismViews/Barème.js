import classNames from 'classnames'
import { ShowValuesContext } from 'Components/rule/ShowValuesContext'
import { numberFormatter } from 'Engine/format'
import { trancheValue } from 'Engine/mecanisms/barème'
import { inferUnit, serialiseUnit } from 'Engine/units'
import { identity } from 'ramda'
import React, { useContext } from 'react'
import { Trans } from 'react-i18next'
import { makeJsx } from '../evaluation'
import './Barème.css'
import { Node, NodeValuePointer } from './common'

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

let Component = function Barème({
	language,
	nodeValue,
	explanation,
	barèmeType,
	lazyEval,
	unit
}) {
	const showValues = useContext(ShowValuesContext)
	return (
		<Node
			classes="mecanism barème"
			name={barèmeType === 'marginal' ? 'barème' : 'barème linéaire'}
			value={nodeValue}
			unit={unit}
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
									{typeof unit === 'string' ? (
										unit
									) : (
										<Trans>
											{explanation.tranches[0].taux != null
												? 'Taux'
												: 'Montant'}
										</Trans>
									)}
								</th>
								{showValues &&
									!explanation.returnRate &&
									explanation.tranches[0].taux != null && (
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
										tranchesUnit: inferUnit('/', [
											explanation.assiette.unit,
											explanation.multiplicateur?.unit
										]),
										resultUnit: explanation.assiette.unit,
										returnRate: explanation.returnRate,
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
					{/* nous avons remarqué que la notion de taux final pour un barème à 2 tranches est moins pertinent pour les règles de calcul des indépendants. Règle empirique à faire évoluer ! */}
					{showValues &&
						!explanation.returnRate &&
						barèmeType === 'marginal' &&
						explanation.tranches.length > 2 && (
							<>
								<b>
									<Trans>Taux final</Trans> :{' '}
								</b>
								<NodeValuePointer
									data={
										(nodeValue / lazyEval(explanation['assiette']).nodeValue) *
										100
									}
								/>
								%
							</>
						)}
					{explanation.returnRate && (
						<p>
							Ce barème <strong>ne retourne que le taux</strong>.
						</p>
					)}
				</ul>
			}
		/>
	)
}

let Tranche = ({
	tranche: {
		'en-dessous de': maxOnly,
		'au-dessus de': minOnly,
		de: min,
		à: max,
		taux,
		montant
	},
	tranchesUnit,
	resultUnit,
	returnRate,
	trancheValue,
	showValues,
	language
}) => {
	const trancheFormatter = numberFormatter({
		language,
		style: serialiseUnit(tranchesUnit) === '€' ? 'currency' : undefined
	})
	let activated = trancheValue > 0
	return (
		<tr className={classNames('tranche', { activated })}>
			<td key="tranche">
				{maxOnly ? (
					<>
						<Trans>En-dessous de</Trans> {trancheFormatter(maxOnly)}
					</>
				) : minOnly ? (
					<>
						<Trans>Au-dessus de</Trans> {trancheFormatter(minOnly)}
					</>
				) : (
					<>
						<Trans>De</Trans> {trancheFormatter(min)} <Trans>à</Trans>{' '}
						{trancheFormatter(max)}
					</>
				)}
			</td>
			<td key="taux"> {taux != null ? makeJsx(taux) : montant}</td>
			{showValues && !returnRate && taux != null && (
				<td key="value">
					<NodeValuePointer data={trancheValue} unit={resultUnit} />
				</td>
			)}
		</tr>
	)
}

//eslint-disable-next-line
export default barèmeType => (
	nodeValue,
	explanation,
	lazyEval = identity,
	unit
) => <Component {...{ nodeValue, explanation, barèmeType, lazyEval, unit }} />
