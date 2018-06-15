import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
//import styles from './.css'
// css in conversation.Css
import { isEmpty } from 'ramda'
import { reset } from 'redux-form'
import { resetSimulation } from '../../actions'
import withColours from '../withColours'
import { scroller, Element, animateScroll } from 'react-scroll'

import { flatRulesSelector } from 'Selectors/analyseSelectors'
import FoldedStep from './FoldedStep'

@withColours
@connect(
	state => ({
		foldedSteps: state.conversationSteps.foldedSteps,
		targetNames: state.targetNames,
		flatRules: flatRulesSelector(state)
	}),
	{
		resetSimulation,
		resetForm: () => reset('conversation')
	}
)
@translate()
export default class FoldedSteps extends Component {
	handleSimulationReset = () => {
		this.props.resetSimulation()
		this.props.resetForm()
	}
	render() {
		let {
			foldedSteps,
			colours: { textColourOnWhite }
		} = this.props

		if (isEmpty(foldedSteps || [])) return null
		return (
			<div id="foldedSteps">
				<div className="header">
					<button
						onClick={this.handleSimulationReset}
						style={{ color: textColourOnWhite }}>
						<i className="fa fa-trash" aria-hidden="true" />
						<Trans i18nKey="resetAll">Tout effacer</Trans>
					</button>
				</div>
				{foldedSteps.map(dottedName => (
					<FoldedStep key={dottedName} dottedName={dottedName} />
				))}
			</div>
		)
	}
}

@withColours
@connect(state => ({
	foldedSteps: state.foldedSteps,
	conversationStarted: state.conversationStarted
}))
export class GoToAnswers extends Component {
	componentDidUpdate(prevProps) {
		if (!prevProps.conversationStarted && this.props.conversationStarted) {
			scroller.scrollTo('myScrollToElement', {
				duration: 200,
				delay: 0,
				smooth: true
			})
			return
		}
		if (prevProps.foldedSteps.length === this.props.foldedSteps.length) return

		scroller.scrollTo('myScrollToElement', {
			duration: 0,
			delay: 0,
			smooth: false
		})
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
						color: this.props.colours.textColourOnWhite,
						visibility: !this.props.foldedSteps.length ? 'hidden' : 'visible'
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
