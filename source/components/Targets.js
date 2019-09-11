import withColours from 'Components/utils/withColours'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import './Targets.css'

export default compose(
	connect(state => ({ analysis: analysisWithDefaultsSelector(state) })),
	withColours,
	withSitePaths
)(function Targets({ analysis, colours, sitePaths }) {
	let { nodeValue, unité: unit, dottedName } = analysis.targets[0]
	return (
		<div id="targets">
			<span className="icon">→</span>
			<span className="content" style={{ color: colours.textColour }}>
				<span className="figure">
					<span className="value">{nodeValue?.toFixed(1)}</span>{' '}
					<span className="unit">{unit}</span>
				</span>
				<Link
					title="Quel est calcul ?"
					style={{ color: colours.colour }}
					to={sitePaths.documentation.index + '/' + dottedName}
					className="explanation">
					{emoji('📖')}
				</Link>
			</span>
		</div>
	)
})
