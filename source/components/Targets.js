import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import './Targets.css'
export default compose(
	connect(state => ({ analysis: analysisWithDefaultsSelector(state) })),
	withColours
)(
	class Targets extends React.Component {
		render() {
			let {
				title,
				nodeValue,
				unité: unit,
				dottedName
			} = this.props.analysis[0].targets[0]
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
							to={'/règle/' + dottedName}
							className="explanation">
							{emoji('📖')}
						</Link>
					</span>
				</div>
			)
		}
	}
)
