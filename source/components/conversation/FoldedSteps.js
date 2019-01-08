import { resetSimulation } from 'Actions/actions'
import { isEmpty } from 'ramda'
import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import { LinkButton } from 'Ui/Button'
import './conversation.css'
import FoldedStep from './FoldedStep'

export default connect(
	state => ({
		foldedSteps: state.conversationSteps.foldedSteps,
		targetNames: state.simulationConfig?.objectifs,
		flatRules: flatRulesSelector(state)
	}),
	{
		resetSimulation
	}
)(
	class FoldedSteps extends Component {
		handleSimulationReset = () => {
			this.props.resetSimulation()
		}
		render() {
			let { foldedSteps } = this.props

			if (isEmpty(foldedSteps || [])) return null
			return (
				<div id="foldedSteps">
					<div className="header">
						<LinkButton onClick={this.handleSimulationReset}>
							<i className="fa fa-trash" aria-hidden="true" />
							<Trans i18nKey="resetAll">Tout effacer</Trans>
						</LinkButton>
					</div>
					{foldedSteps.map(dottedName => (
						<FoldedStep key={dottedName} dottedName={dottedName} />
					))}
				</div>
			)
		}
	}
)
