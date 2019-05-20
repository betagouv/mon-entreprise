/* @flow */

import Distribution from 'Components/Distribution'
import PaySlip from 'Components/PaySlip'
import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
// $FlowFixMe
import { formValueSelector } from 'redux-form'

type OwnProps = {}
type Props = OwnProps & {
	period: 'mois' | 'année'
}

export default (connect(state => ({
	period: formValueSelector('conversation')(state, 'période')
}))(
	class SalaryFirstExplanation extends Component<Props> {
		render() {
			return (
				<>
					<h2>
						<Trans>À quoi servent mes cotisations ?</Trans>
					</h2>
					<Distribution />

					<h2>
						<Trans>
							{this.props.period === 'mois'
								? 'Fiche de paie mensuelle'
								: 'Détail annuel des cotisations'}
						</Trans>
					</h2>
					<PaySlip />
				</>
			)
		}
	}
): React$ComponentType<OwnProps>)
