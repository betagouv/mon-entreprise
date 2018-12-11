import React from 'react'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import { connect } from 'react-redux'
import './Targets.css'
import withColours from 'Components/utils/withColours'
import { Link } from 'react-router-dom'
import emoji from 'react-easy-emoji'
import { compose } from 'ramda'
import branches from './simulateur-rémunération-dirigeant.yaml'

export default compose(
	connect(state => ({
		analyses: analysisWithDefaultsSelector(state, { branches })
	})),
	withColours
)(
	class Targets extends React.Component {
		render() {
			return (
				<div id="targets">
					<div
						className="content"
						style={{ color: this.props.colours.textColour }}>
						<ul>
							{this.props.analyses.map((analysis, i) => {
								let { title, nodeValue, dottedName } = analysis.targets[0]
								return (
									<li>
										{branches[i].nom}
										<span className="figure">
											<span className="value">{nodeValue?.toFixed(1)}</span>{' '}
										</span>
										<Link
											title="Quel est calcul ?"
											style={{ color: this.props.colours.colour }}
											to={'/règle/' + dottedName}
											className="explanation">
											{emoji('📖')}
										</Link>
									</li>
								)
							})}
						</ul>
					</div>
				</div>
			)
		}
	}
)
