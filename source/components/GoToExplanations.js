import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { Element, scroller } from 'react-scroll'
import './conversation/conversation.css'
import { SimpleButton } from './ui/Button'
import withColours from './withColours'
import withTracker from './withTracker'

@translate()
@withColours
@withTracker
export default class GoToExplanation extends Component {
	handleScrollToResults = () => {
		this.props.tracker.push(['trackEvent', 'simulation', 'goToExplanation'])
		scroller.scrollTo('resultsScrollElement', {
			smooth: true,
			duration: 200,
			delay: 0
		})
	}
	render() {
		return (
			<Element name="resultsScrollElement" id="resultsScrollElement">
				<SimpleButton
					className="scrollIndication down"
					onClick={this.handleScrollToResults}>
					<i className="fa fa-long-arrow-down" aria-hidden="true" />
					&nbsp;<Trans i18nKey="details">Comprendre mes résultats</Trans>
				</SimpleButton>
			</Element>
		)
	}
}
