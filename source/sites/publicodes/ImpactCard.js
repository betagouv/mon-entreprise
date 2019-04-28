import withColours from 'Components/utils/withColours'
import withSitePaths from 'Components/utils/withSitePaths'
import { mapObjIndexed, compose, toPairs } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import * as chrono from './chrono'

let individualEmissionsLimitPerYear = 1000 // 1 ton, to be parametrable

let limitPerPeriod = mapObjIndexed(v => v * individualEmissionsLimitPerYear, {
	...chrono,
	négligeable: 0
})

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
)(function Targets({ analysis, colours, sitePaths }) {
	let { nodeValue, dottedName } = analysis.targets[0]

	let [value, unit] = humanWeightValue(nodeValue)

	let found = toPairs(limitPerPeriod).find(
		([, limit]) => limit <= Math.abs(nodeValue)
	)
	if (!found) console.log(limitPerPeriod, nodeValue)

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
					color: ${this.props.colours.textColour};
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
					font-style: italic;
				`}>
				<div>
					Soit {value} {unit} &nbsp;
					<Link
						to={this.props.sitePaths.documentation.index + '/' + dottedName}>
						calcul
					</Link>
				</div>
				<div>de crédit carbone personnel</div>
			</div>
			<div
				css={`
					font-size: 85%;
					color: #444;
					font-style: italic;
				`}>
				<div>
					Soit {value} {unit} &nbsp;
					<Link
						to={this.props.sitePaths.documentation.index + '/' + dottedName}>
						calcul
					</Link>
				</div>
			</div>
		</div>
	)
})
