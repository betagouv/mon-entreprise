/* @flow */

import React, { PureComponent } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { SimpleButton } from '../ui/Button'
import Card from '../ui/Card'
import Distribution from './Distribution'
import PaySlip from './PaySlip'
import './ResultView.css'

type State = {
	resultView: 'distribution' | 'payslip'
}
type Props = {
	conversationStarted: boolean
}

const resultViewTitle = {
	distribution: 'Mes cotisations',
	payslip: 'Ma fiche de paie'
}

class ResultView extends PureComponent<Props, State> {
	state = {
		resultView: this.props.conversationStarted ? 'payslip' : 'distribution'
	}
	render() {
		return (
			<>
				<div className="result-view__tabs">
					{['distribution', 'payslip'].map(resultView => (
						<SimpleButton
							key={resultView}
							className={this.state.resultView === resultView ? 'selected' : ''}
							onClick={() => this.setState({ resultView })}>
							<Trans>{resultViewTitle[resultView]}</Trans>
						</SimpleButton>
					))}
					<div className="white-space" />
				</div>
				<Card className="result-view__body">
					{this.state.resultView === 'payslip' ? <PaySlip /> : <Distribution />}
				</Card>
			</>
		)
	}
}

export default connect(
	state => ({
		conversationStarted: state.conversationStarted,
		key: state.conversationStarted
	}),
	{}
)(ResultView)
