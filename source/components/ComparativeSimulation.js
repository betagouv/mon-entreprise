import React from 'react'
import { connect } from 'react-redux'
import { isEmpty, compose } from 'ramda'
import Answers from 'Components/AnswerList'
import Conversation from 'Components/conversation/Conversation'
import withColours from 'Components/utils/withColours'
import ComparativeTargets from 'Components/ComparativeTargets'
import './ComparativeSimulation.css'
import {
	nextStepsSelector,
	analysisWithDefaultsSelector
} from 'Selectors/analyseSelectors'
import Controls from './Controls'
import simulationConfig from './simulateur-rémunération-dirigeant.yaml'

export default compose(
	withColours,
	connect(state => ({
		previousAnswers: state.conversationSteps.foldedSteps,
		noNextSteps: nextStepsSelector(state, simulationConfig).length == 0,
		analysis: analysisWithDefaultsSelector(state, simulationConfig)
	}))
)(
	class extends React.Component {
		state = {
			displayAnswers: false
		}
		render() {
			let {
				colours,
				noNextSteps,
				previousAnswers,
				analysis: { controls }
			} = this.props
			return (
				<div id="ComparativeSimulation" className="ui__ container">
					<header>
						<h1>{simulationConfig.titre}</h1>
					</header>
					<div id="simulationContent">
						{!isEmpty(previousAnswers) && (
							<button
								style={{
									background: colours.colour,
									color: colours.textColour
								}}
								onClick={() => this.setState({ displayAnswers: true })}>
								Mes réponses
							</button>
						)}

						{this.state.displayAnswers && (
							<Answers
								onClose={() => this.setState({ displayAnswers: false })}
							/>
						)}
						<Conversation
							simulationConfig={simulationConfig}
							textColourOnWhite={this.props.colours.textColourOnWhite}
						/>
						<Controls {...{ controls }} />
						{noNextSteps && (
							<>
								<h2>Plus de questions ! </h2>
								<p>Vous avez atteint l'estimation la plus précise.</p>
							</>
						)}
						<ComparativeTargets />
					</div>
				</div>
			)
		}
	}
)
