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
import PeriodSwitch from 'Components/PeriodSwitch'

export default compose(
	connect(state => ({
		analyses: analysisWithDefaultsSelector(state, simulationConfig)
	})),
	withColours
)(
	class ComparativeTargets extends React.Component {
		render() {
			let { colours, analyses } = this.props
			return (
				<div id="targets">
					<h3>{analyses[0].targets[0].title}</h3>
					<PeriodSwitch />
					<ul>
						{analyses.map((analysis, i) => {
							let { title, nodeValue, dottedName } = analysis.targets[0],
								name = simulationConfig.branches[i].nom
							return (
								<li
									style={{
										color: colours.textColour,
										background: `linear-gradient(
							60deg,
							${colours.darkColour} 0%,
							${colours.colour} 100%
						)`
									}}
									key={name}>
									<span className="title">{name}</span>
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
			)
		}
	}
)
