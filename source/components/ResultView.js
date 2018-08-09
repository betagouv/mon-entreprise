/* @flow */

import Distribution from 'Components/Distribution'
import PaySlip from 'Components/PaySlip'
import SearchButton from 'Components/SearchButton'
import withTracker from 'Components/utils/withTracker'
import { compose } from 'ramda'
import React, { PureComponent } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import Card from 'Ui/Card'
import './ResultView.css'
import type { Tracker } from 'Components/utils/withTracker'

type State = {
	resultView: 'distribution' | 'payslip'
}
type Props = {
	conversationStarted: boolean,
	tracker: Tracker
}

const resultViewTitle = {
	distribution: 'Cotisations',
	payslip: 'Fiche de paie'
}

class ResultView extends PureComponent<Props, State> {
	state = {
		resultView: this.props.conversationStarted ? 'payslip' : 'distribution'
	}
	handleClickOnTab = resultView => () => {
		this.setState({ resultView })
		this.props.tracker.push(['trackEvent', 'results', 'selectView', resultView])
	}
	render() {
		return (
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
				<Card className="result-view__body">
					{this.state.resultView === 'payslip' ? <PaySlip /> : <Distribution />}
				</Card>
			</>
		)
	}
}

export default compose(
	withTracker,
	connect(
		state => ({
			conversationStarted: state.conversationStarted,
			key: state.conversationStarted
		}),
		{}
	)
)(ResultView)
