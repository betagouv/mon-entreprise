import { startConversation } from 'Actions/actions'
import { React, T } from 'Components'
import withTracker from 'Components/utils/withTracker'
import { compose } from 'ramda'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import ficheDePaieSelectors from 'Selectors/ficheDePaieSelectors'
import * as Animate from 'Ui/animate'
import SalaryCompactExplanation from './SalaryCompactExplanation'
import './SalaryCompactExplanation.css'
import SalaryFirstExplanation from './SalaryFirstExplanation'

export default compose(
	withTracker,
	connect(
		state => ({
			conversationStarted: state.conversationStarted,
			displayResults: !!ficheDePaieSelectors(state),
			arePreviousAnswers: state.conversationSteps.foldedSteps.length > 0,
			period: formValueSelector('conversation')(state, 'période')
		}),
		{
			startConversation
		}
	)
)(
	class SalaryExplanation extends React.Component {
		render() {
			return (
				<Animate.fromTop delay={this.props.conversationStarted ? 0 : 1000}>
					{!this.props.conversationStarted ? (
						<>
							<p className="ui__ notice">
								<T k="simulateurs.salarié.description">
									Dès que l'embauche d'un salarié est déclarée et qu'il est
									payé, il est couvert par le régime général de la Sécurité
									sociale (santé, maternité, invalidité, vieillesse, maladie
									professionnelle et accidents) et chômage.
								</T>
							</p>
							<SalaryFirstExplanation {...this.props} />
						</>
					) : (
						<SalaryCompactExplanation {...this.props} />
					)}
					<div style={{ textAlign: 'center' }} />
				</Animate.fromTop>
			)
		}
	}
)
