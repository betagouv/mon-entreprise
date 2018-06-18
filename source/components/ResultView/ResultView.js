/* @flow */

import React, { PureComponent } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import Button from '../ui/Button'
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
		resultView: 'distribution'
	}
	static getDerivedStateFromProps(nextProps) {
		return {
			resultView: nextProps.conversationStarted ? 'payslip' : 'distribution'
		}
	}
	render() {
		return (
			<>
				<div className="result-view-header">
					<h2>
						<Trans>{resultViewTitle[this.state.resultView]}</Trans>
					</h2>
					{this.state.resultView === 'distribution' ? (
						<Button onClick={() => this.setState({ resultView: 'payslip' })}>
							<Trans>Voir ma fiche de paie</Trans>
						</Button>
					) : (
						<Button
							onClick={() => this.setState({ resultView: 'distribution' })}>
							<Trans>Voir la répartition des cotisations</Trans>
						</Button>
					)}
				</div>
				{this.state.resultView === 'payslip' ? <PaySlip /> : <Distribution />}
			</>
		)
	}
}

export default connect(
	state => ({
		conversationStarted: state.conversationStarted
	}),
	{}
)(ResultView)
