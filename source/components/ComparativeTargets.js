import React from 'react'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import { connect } from 'react-redux'
import './ComparativeTargets.css'
import withColours from 'Components/utils/withColours'
import { Link } from 'react-router-dom'
import emoji from 'react-easy-emoji'
import { compose } from 'ramda'
import simulationConfig from './simulateur-rémunération-dirigeant.yaml'
import AnimatedTargetValue from './AnimatedTargetValue'

export default compose(
	connect(state => ({
		analyses: analysisWithDefaultsSelector(state, simulationConfig)
	})),
	withColours
)(
	class ComparativeTargets extends React.Component {
		render() {
			return (
				<div id="targets">
					<div
						className="content"
						style={{ color: this.props.colours.textColour }}>
						<ul>
							{this.props.analyses.map((analysis, i) => {
								let { title, nodeValue, dottedName } = analysis.targets[0],
									name = simulationConfig.branches[i].nom
								return (
									<li key={name}>
										{name}
										<span className="figure">
											<span className="value">
												<AnimatedTargetValue value={nodeValue} />
											</span>{' '}
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
