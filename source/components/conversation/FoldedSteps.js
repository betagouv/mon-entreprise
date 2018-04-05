import React, { Component } from 'react'
import { connect } from 'react-redux'
//import styles from './.css'
// css in conversation.Css
import { isEmpty, map } from 'ramda'
import ReactPiwik from '../Tracker'
import { getInputComponent } from 'Engine/generateQuestions'
import withColours from '../withColours'
import { scroller, Element } from 'react-scroll'

let scroll = () =>
	scroller.scrollTo('myScrollToElement', {
		duration: 500,
		delay: 0,
		smooth: true
	})

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
			// TODO horrible hack : our state should be refactored to enable resetting the relevant part of it
			window.location.reload(false)
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
			</div>
		)
	}
}

@withColours
@connect(state => ({
	foldedSteps: state.foldedSteps
}))
export class GoToAnswers extends Component {
	componentWillReceiveProps(nextProps) {
		if (nextProps.foldedSteps.length == this.props.foldedSteps.length)
			return null

		setTimeout(scroll, 1) // scrolling after the first answer doesn't work
	}
	render() {
		return (
			<Element name="myScrollToElement" id="myScrollToElement">
				<h3
					className="scrollIndication up"
					style={{
						opacity: this.props.foldedSteps.length != 0 ? 1 : 0,
						color: this.props.colours.textColourOnWhite
					}}
				>
					<i className="fa fa-long-arrow-up" aria-hidden="true" /> Modifier mes
					réponses
				</h3>
			</Element>
		)
	}
}
