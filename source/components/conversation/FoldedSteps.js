import React, { Component } from 'react'
import { connect } from 'react-redux'
//import styles from './.css'
import { isEmpty, map } from 'ramda'
import ReactPiwik from '../Tracker'
import { getInputComponent } from 'Engine/generateQuestions'
import withColours from '../withColours'

@withColours
@connect(
	state => ({
		currentQuestion: state.currentQuestion,
		foldedSteps: state.foldedSteps,
		themeColours: state.themeColours,
		situationGate: state.situationGate,
		targetNames: state.targetNames,
		done: state.done,
		nextSteps: state.nextSteps,
		analysis: state.analysis,
		parsedRules: state.parsedRules
	}),
	dispatch => ({
		reinitialise: () => {
			ReactPiwik.push(['trackEvent', 'restart', ''])
			dispatch(reset('conversation'))
			dispatch({ type: 'SET_CONVERSATION_TARGETS', reset: true })
		}
	})
)
export default class extends Component {
	render() {
		let {
			foldedSteps,
			reinitialise,
			targetNames,
			parsedRules,
			textColourOnWhite
		} = this.props

		if (isEmpty(foldedSteps || [])) return null
		return (
			<div id="foldedSteps">
				<div className="header">
					<button onClick={reinitialise} style={{ color: textColourOnWhite }}>
						<i className="fa fa-trash" aria-hidden="true" />
						Tout effacer
					</button>
				</div>
				{map(
					getInputComponent({ unfolded: false })(parsedRules, targetNames),
					foldedSteps
				)}
				<h3
					className="scrollIndication up"
					style={{
						opacity: foldedSteps.length != 0 ? 1 : 0,
						color: textColourOnWhite
					}}
				>
					<i className="fa fa-long-arrow-up" aria-hidden="true" /> Modifier mes
					réponses
				</h3>
			</div>
		)
	}
}
