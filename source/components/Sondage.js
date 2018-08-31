import withLanguage from 'Components/utils/withLanguage'
import withTracker from 'Components/utils/withTracker'
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { nextStepsSelector } from 'Selectors/analyseSelectors'
import { noUserInputSelector } from 'Selectors/situationSelectors'
import Smiley from './SatisfactionSmiley'

@connect(state => ({
	conversationStarted: state.conversationStarted,
	noUserInput: noUserInputSelector(state),
	nextSteps: nextStepsSelector(state)
}))
@translate()
@withLanguage
@withTracker
export default class Sondage extends Component {
	state = {
		visible: true,
		showForm: false,
		askFeedbackTime: 'AFTER_FIRST_ESTIMATE'
	}

	handleClose = () => {
		this.setState({ visible: false })
	}
	onSmileyClick = satisfaction => {
		this.props.tracker.push(['trackEvent', 'feedback', 'smiley', satisfaction])
		this.setState({ showForm: true, satisfaction, visible: false })
	}
	render() {
		let { satisfaction, showForm, visible } = this.state
		return (
			<div className="sondage__container">
				{showForm &&
					(satisfaction === ':|' ? (
						<p className="ui__ notice">
							<strong>
								<Trans i18nKey="feedback.bad.headline">
									Nous sommes désolé de ne pas vous avoir apporté entière
									satisfaction.
								</Trans>
							</strong>{' '}
							<Trans i18nKey="feedback.bad.support">
								Si vous le souhaitez, vous pouvez nous envoyer un mail à{' '}
								<a href="mailto:contact@embauche.beta.gouv.fr">
									contact@embauche.beta.gouv.fr
								</a>
								Nous vous garantissons de vous répondre au plus vite, et de
								faire tout notre possible pour vous venir en aide
							</Trans>
						</p>
					) : (
						<p className="ui__ notice">
							<strong>
								<Trans i18nKey="feedback.good.headline">
									Merci pour votre retour !
								</Trans>
							</strong>{' '}
							<Trans i18nKey="feedback.good.support">
								Si vous avez une remarque, ou une idée d'amélioration, n'hésitez
								pas à nous contacter directement par mail à
								<a href="mailto:contact@embauche.beta.gouv.fr">
									contact@embauche.beta.gouv.fr
								</a>
							</Trans>
						</p>
					))}
				{visible && (
					<p className="ui__ notice">
						<span className="sondage__text">
							<Trans>Votre avis nous intéresse !</Trans>
						</span>
						<br />
						<Smiley
							text=":)"
							hoverColor="#16a085"
							onClick={this.onSmileyClick}
						/>
						<Smiley
							text=":|"
							hoverColor="#f39c12"
							onClick={this.onSmileyClick}
						/>
					</p>
				)}
			</div>
		)
	}
}
