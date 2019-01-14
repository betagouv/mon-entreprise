/* @flow */

import Distribution from 'Components/Distribution'
import PaySlip from 'Components/PaySlip'
import SearchButton from 'Components/SearchButton'
import withTracker from 'Components/utils/withTracker'
import { compose } from 'ramda'
import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import ficheDePaieSelectors from 'Selectors/ficheDePaieSelectors'
import './ResultView.css'

import type { Tracker } from 'Components/utils/withTracker'

type State = {
	resultView: 'distribution' | 'payslip'
}
type Props = {
	conversationStarted: boolean,
	tracker: Tracker,
	displayResults: boolean
}

const resultViewTitle = {
	distribution: 'Cotisations',
	payslip: 'Fiche de paie'
}

class ResultView extends Component<Props, State> {
	state = {
		resultView: this.props.conversationStarted ? 'payslip' : 'distribution'
	}
	handleClickOnTab = resultView => () => {
		this.setState({ resultView })
		this.props.tracker.push(['trackEvent', 'results', 'selectView', resultView])
	}
	render() {
		return (
			this.props.displayResults && (
				<>
					<div className="result-view__header">
						<div className="result-view__tabs">
							{['payslip', 'distribution'].map(resultView => (
								<button
									key={resultView}
									className={
										'ui__ link-button ' +
										(this.state.resultView === resultView ? 'selected' : '')
									}
									onClick={this.handleClickOnTab(resultView)}>
									<Trans>{resultViewTitle[resultView]}</Trans>
								</button>
							))}
						</div>
						<SearchButton rulePageBasePath="./règle" />
					</div>
					<div className="ui__ card result-view__body">
						{this.state.resultView === 'payslip' ? (
							<PaySlip />
						) : (
							<Distribution />
						)}
					</div>
				</>
			)
		)
	}
}

export default compose(
	withTracker,
	connect(
		state => ({
			conversationStarted: state.conversationStarted,
			key: state.conversationStarted,
			displayResults: !!ficheDePaieSelectors(state)
		}),
		{}
	)
)(ResultView)
