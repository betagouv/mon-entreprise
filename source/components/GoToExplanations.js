import { path } from 'ramda'
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Element, scroller } from 'react-scroll'
import './Explanation.css'
import withColours from './withColours'

@translate()
@withColours
@connect(state => ({
	analysis: state.analysis
}))
export default class GoToExplanation extends Component {
	handleScrollToResults = () => {
		scroller.scrollTo('resultsScrollElement', {
			smooth: true,
			duration: 200,
			delay: 0
		})
	}
	render() {
		let targetRules = path(['analysis', 'targets'], this.props)
		if (!targetRules) return null

		return (
			<Element name="resultsScrollElement" id="resultsScrollElement">
				<h3
					className="scrollIndication down"
					style={{
						color: this.props.colours.textColourOnWhite
					}}>
					<button
						className="unstyledButton"
						onClick={this.handleScrollToResults}>
						<i className="fa fa-long-arrow-down" aria-hidden="true" />
						&nbsp;<Trans i18nKey="details">Explorer la fiche de paie</Trans>
					</button>
				</h3>
			</Element>
		)
	}
}
