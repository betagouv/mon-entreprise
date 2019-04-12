import withColours from 'Components/utils/withColours'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import './ImpactCard.css'

let humanValue = v => {
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
	let { nodeValue, unité: unit, dottedName } = analysis.targets[0]
	let [value, unit] = humanValue(nodeValue)
	return (
		<div id="targets">
			<div
				className="content"
				css={`
					color: ${this.props.colours.textColour};
				`}>
				<span className="figure">
					<span className="value">{value}</span>{' '}
					<span className="unit">{unit}</span>
				</span>
			</div>
			<Link
				to={this.props.sitePaths.documentation.index + '/' + dottedName}
				className="explanation">
				{emoji('💭 ')}
				comprendre le calcul
			</Link>
		</div>
	)
})
