import withColours from 'Components/utils/withColours'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import sitePaths from '../../sites/mycompanyinfrance.fr/sitePaths'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import './SimpleTarget.css'

export default compose(
	connect(state => ({ analysis: analysisWithDefaultsSelector(state) })),
	withColours,
	withSitePaths
)(
	class Targets extends React.Component {
		render() {
			let {
				title,
				nodeValue,
				unité: unit,
				dottedName
			} = this.props.analysis.targets[0]
			return (
				<div id="targets">
					<span className="icon">→</span>
					<span
						className="content"
						style={{ color: this.props.colours.textColour }}>
						{/*<span className="title">{title}</span>
					{' : '} */}
						<span className="figure">
							<span className="value">{nodeValue?.toFixed(1)}</span>{' '}
							<span className="unit">{unit}</span>
						</span>
						<Link
							title="Quel est calcul ?"
							style={{ color: this.props.colours.colour }}
							to={this.props.sitePaths.documentation.index + '/' + dottedName}
							className="explanation">
							{emoji('❔')}
						</Link>
					</span>
				</div>
			)
		}
	}
)
