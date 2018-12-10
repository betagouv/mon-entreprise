import React from 'react'
import { connect } from 'react-redux'
import { isEmpty, compose } from 'ramda'
import Answers from 'Components/AnswerList'
import Conversation from 'Components/conversation/Conversation'
import withColours from 'Components/utils/withColours'
import Targets from 'Components/Targets'
import './GenericSimulation.css'
import {
	nextStepsSelector,
	analysisWithDefaultsSelector
} from 'Selectors/analyseSelectors'
import { reduxForm } from 'redux-form'
import PeriodSwitch from 'Components/PeriodSwitch'
import Controls from './Controls'

export default compose(
	withColours,
	connect(state => ({
		previousAnswers: state.conversationSteps.foldedSteps,
		noNextSteps: nextStepsSelector(state).length == 0,
		analysis: analysisWithDefaultsSelector(state)
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
				<div id="GenericSimulation">
					<header>
						<img src="https://images.unsplash.com/photo-1488722796624-0aa6f1bb6399?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" />
						<h1>Quel revenu au régime des indépendants ?</h1>
						<PeriodSwitch />
					</header>
					<div className="ui__ container" id="simulationContent">
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
							textColourOnWhite={this.props.colours.textColourOnWhite}
						/>
						<Controls {...{ controls }} />
						{noNextSteps && (
							<>
								<h2>Plus de questions ! </h2>
								<p>Vous avez atteint l'estimation la plus précise.</p>
							</>
						)}
						<Targets />
					</div>
				</div>
			)
		}
	}
)
