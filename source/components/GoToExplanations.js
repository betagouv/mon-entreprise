import withColours from 'Components/utils/withColours'
import withTracker from 'Components/utils/withTracker'
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { Element, scroller } from 'react-scroll'
import { LinkButton } from 'Ui/Button'
import './conversation/conversation.css'

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
				<LinkButton
					className="scrollIndication down"
					onClick={this.handleScrollToResults}>
					<i className="fa fa-long-arrow-down" aria-hidden="true" />
					&nbsp;<Trans i18nKey="details">Comprendre mes résultats</Trans>
				</LinkButton>
			</Element>
		)
	}
}
