import withColours from 'Components/utils/withColours'
import withSitePaths from 'Components/utils/withSitePaths'
import { mapObjIndexed, compose, toPairs } from 'ramda'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import * as chrono from './chrono'
import { StoreContext } from './StoreContext'
import scenarios from './scenarios.yaml'

let humanWeightValue = v => {
	let unitSuffix = "d'équivalent CO₂"
	let [raw, unit] =
		v === 0
			? [v, '']
			: v < 1
			? [v * 1000, 'g']
			: v < 1000
			? [v, 'kilos']
			: [v / 1000, 'tonnes']

	return [raw.toFixed(1), unit + ' ' + unitSuffix]
}

export default compose(
	connect(state => ({ analysis: analysisWithDefaultsSelector(state) })),
	withColours,
	withSitePaths
)(({ analysis: { targets }, sitePaths }) => {
	let { state } = useContext(StoreContext)
	let { nodeValue, dottedName } = targets[0]

	let [value, unit] = humanWeightValue(nodeValue)
	let limitPerPeriod = mapObjIndexed(
		v => v * scenarios[state.scenario]['crédit carbone par personne'] * 1000,
		{
			...chrono,
			négligeable: 0
		}
	)

	let found = toPairs(limitPerPeriod).find(
		([, limit]) => limit <= Math.abs(nodeValue)
	)

	let [closestPeriod, closestPeriodValue] = found,
		factor = Math.round(nodeValue / closestPeriodValue),
		closestPeriodLabel = closestPeriod.startsWith('demi')
			? closestPeriod.replace('demi', 'demi-')
			: closestPeriod
	return (
		<div
			css={`
				margin: 5rem auto 2rem;
				text-align: center;
			`}>
			<div
				css={`
					border-radius: 6px;
					background: var(--colour);
					padding: 1em;
					width: 18em;
					margin: 0 auto;
					margin-bottom: 0.6em;
					color: var(--textColour);
				`}>
				{closestPeriodLabel === 'négligeable' ? (
					<span>Impact négligeable {emoji('😎')}</span>
				) : (
					<>
						<div
							css={`
								font-size: 220%;
							`}>
							{factor +
								' ' +
								closestPeriodLabel +
								(closestPeriod[closestPeriod.length - 1] !== 's' && factor > 1
									? 's'
									: '')}
						</div>
						de&nbsp;
						<Link css="color: inherit" to="/scénarios">
							crédit carbone personnel
						</Link>
					</>
				)}
			</div>
			<div
				css={`
					font-size: 85%;
					color: #444;
				`}>
				<div>
					Soit {value} {unit} &nbsp;
					<Link to={sitePaths.documentation.index + '/' + dottedName}>
						explication
					</Link>
				</div>
			</div>
		</div>
	)
})
