import withColours from 'Components/utils/withColours'
import withSitePaths from 'Components/utils/withSitePaths'
import { mapObjIndexed, compose, toPairs } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import './ImpactCard.css'
import * as chrono from './chrono'

let individualEmissionsLimitPerYear = 1000 // 1 ton, to be parametrable

let limitPerPeriod = mapObjIndexed(
	v => v * individualEmissionsLimitPerYear,
	chrono
)

let humanWeightValue = v => {
	let unitSuffix = 'équivalent CO₂'
	let [raw, unit] =
		v === 0
			? [v, '']
			: v < 1
			? [v * 1000, 'grammes']
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

	let [closestPeriod, closestPeriodValue] = toPairs(limitPerPeriod).find(
			([period, limit]) => limit < nodeValue
		),
		factor = nodeValue / closestPeriodValue
	return (
		<div id="targets">
			Crédit carbone personnel
			<div
				className="content"
				css={`
					color: ${colours.textColour};
				`}>
				<span className="figure">
					{Math.round(factor) +
						' ' +
						closestPeriod +
						(closestPeriod[closestPeriod.length - 1] !== 's' && factor > 1
							? 's'
							: '')}
				</span>
			</div>
			<Link
				to={sitePaths.documentation.index + '/' + dottedName}
				className="explanation">
				{emoji('💭 ')}
				comprendre le calcul
			</Link>
		</div>
	)
})
