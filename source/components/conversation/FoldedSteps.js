import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
//import styles from './.css'
// css in conversation.Css
import { isEmpty, map, pick } from 'ramda'
import ReactPiwik from '../Tracker'
import { getInputComponent } from 'Engine/generateQuestions'
import withColours from '../withColours'
import { scroller, Element, animateScroll } from 'react-scroll'

let scroll = () =>
	scroller.scrollTo('myScrollToElement', {
		duration: 0,
		delay: 0,
		smooth: false
	})

@withColours
@connect(
	pick([
		'currentQuestion',
		'foldedSteps',
		'themeColours',
		'situationGate',
		'targetNames',
		'nextSteps',
		'analysis',
		'flatRules'
	]),
	dispatch => ({
		reinitialise: () => {
			ReactPiwik.push(['trackEvent', 'restart', ''])
			// TODO horrible hack : our state should be refactored to enable resetting the relevant part of it
			window.location.reload(false)
		}
	})
)
@translate()
export default class extends Component {
	render() {
		let {
			foldedSteps,
			reinitialise,
			targetNames,
			flatRules,
			themeColours: { textColourOnWhite }
		} = this.props

		if (isEmpty(foldedSteps || [])) return null
		return (
			<div id="foldedSteps">
				<div className="header">
					<button onClick={reinitialise} style={{ color: textColourOnWhite }}>
						<i className="fa fa-trash" aria-hidden="true" />
						<Trans i18nKey="resetAll">Tout effacer</Trans>
					</button>
				</div>
				{map(
					getInputComponent({ unfolded: false })(flatRules, targetNames),
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
	componentDidMount() {
		scroll()
	}
	componentDidUpdate(prevProps) {
		if (prevProps.foldedSteps.length == this.props.foldedSteps.length)
			return null
		scroll()
	}
	handleScrollToAnswers = () => {
		animateScroll.scrollToTop({
			duration: 200,
			delay: 0,
			smooth: true
		})
	}
	render() {
		return (
			<Element name="myScrollToElement" id="myScrollToElement">
				<h3
					className="scrollIndication up"
					style={{
						opacity: this.props.foldedSteps.length != 0 ? 1 : 0,
						color: this.props.colours.textColourOnWhite
					}}>
					<button
						className="unstyledButton"
						onClick={this.handleScrollToAnswers}>
						<i className="fa fa-long-arrow-up" aria-hidden="true" />
						&nbsp;<Trans i18nKey="change">Modifier mes réponses</Trans>
					</button>
				</h3>
			</Element>
		)
	}
}
