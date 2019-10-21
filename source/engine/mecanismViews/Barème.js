import classNames from 'classnames'
import { ShowValuesContext } from 'Components/rule/ShowValuesContext'
import RuleLink from 'Components/RuleLink'
import { numberFormatter } from 'Engine/format'
import { trancheValue } from 'Engine/mecanisms/barème'
import { inferUnit, serialiseUnit } from 'Engine/units'
import { identity } from 'ramda'
import React, { useContext } from 'react'
import { Trans } from 'react-i18next'
import { makeJsx } from '../evaluation'
import './Barème.css'
import { Node, NodeValuePointer } from './common'

export let BarèmeAttributes = ({ explanation, lazyEval = identity }) => {
	const multiplicateur = lazyEval(explanation['multiplicateur'])
	const multiplicateurAcronym = multiplicateur?.explanation?.acronyme

	return (
		<>
			<li key="assiette">
				<span className="key">
					<Trans>assiette</Trans>:{' '}
				</span>
				<span className="value">{makeJsx(lazyEval(explanation.assiette))}</span>
			</li>
			{explanation['multiplicateur'] &&
				explanation['multiplicateur'].nodeValue !== 1 &&
				!multiplicateurAcronym && (
					<li key="multiplicateur">
						<span className="key">
							<Trans>multiplicateur</Trans>:{' '}
						</span>
						<span className="value">{makeJsx(multiplicateur)}</span>
					</li>
				)}
		</>
	)
}

let Component = function Barème({
	language,
	nodeValue,
	explanation,
	barèmeType,
	lazyEval,
	unit
}) {
	const showValues = useContext(ShowValuesContext)
	const multiplicateur = lazyEval(explanation?.multiplicateur)
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
										multiplicateur,
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
					{/* nous avons remarqué que la notion de taux moyen pour un barème à 2 tranches est moins pertinent pour les règles de calcul des indépendants. Règle empirique à faire évoluer ! */}
					{showValues &&
						!explanation.returnRate &&
						barèmeType === 'marginal' &&
						explanation.tranches.length > 2 && (
							<>
								<b>
									<Trans>Taux moyen</Trans> :{' '}
								</b>
								<NodeValuePointer
									data={nodeValue / lazyEval(explanation['assiette']).nodeValue}
									unit="%"
								/>
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
	multiplicateur,
	tranchesUnit,
	resultUnit,
	returnRate,
	trancheValue,
	showValues,
	language
}) => {
	const trancheFormatter = value => (
		<TrancheFormatter
			{...{
				language,
				tranchesUnit,
				resultUnit,
				multiplicateur,
				value
			}}
		/>
	)

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
			<td key="taux"> {taux != null ? makeJsx(taux) : makeJsx(montant)}</td>
			{showValues && !returnRate && taux != null && (
				<td key="value">
					<NodeValuePointer data={trancheValue} unit={resultUnit} />
				</td>
			)}
		</tr>
	)
}

function TrancheFormatter({
	language,
	tranchesUnit,
	resultUnit,
	multiplicateur,
	value
}) {
	const multiplicateurAcronym = multiplicateur?.explanation?.acronyme
	if (!multiplicateurAcronym) {
		return numberFormatter({
			language,
			style: serialiseUnit(tranchesUnit) === '€' ? 'currency' : undefined
		})(value)
	} else {
		return (
			<>
				{value}&nbsp;
				<RuleLink
					{...multiplicateur.explanation}
					title={multiplicateur.explanation.name}>
					{multiplicateurAcronym}
				</RuleLink>{' '}
				<NodeValuePointer
					data={value * multiplicateur.nodeValue}
					unit={resultUnit}
				/>
			</>
		)
	}
}

//eslint-disable-next-line
export default barèmeType => (
	nodeValue,
	explanation,
	lazyEval = identity,
	unit
) => <Component {...{ nodeValue, explanation, barèmeType, lazyEval, unit }} />
