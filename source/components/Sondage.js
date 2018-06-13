import React, { Component } from 'react'
import './Sondage.css'
import { connect } from 'react-redux'
import ReactPiwik from './Tracker'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Smiley from './SatisfactionSmiley'
import TypeFormEmbed from './TypeFormEmbed'
import withLanguage from './withLanguage'
import { Trans, translate } from 'react-i18next'
import {
	noUserInputSelector,
	nextStepsSelector
} from 'Selectors/analyseSelectors'

@connect(state => ({
	conversationStarted: state.conversationStarted,
	noUserInput: noUserInputSelector(state),
	nextSteps: nextStepsSelector(state)
}))
@translate()
@withLanguage
export default class Sondage extends Component {
	state = {
		visible: false,
		showForm: false,
		askFeedbackTime: 'AFTER_FIRST_ESTIMATE'
	}
	static getDerivedStateFromProps(nextProps, currentState) {
		let feedbackAlreadyAsked = !!document.cookie.includes('feedback_asked=true')
		let conditions = {
			AFTER_FIRST_ESTIMATE: !nextProps.noUserInput,
			AFTER_SIMULATION_COMPLETED:
				!nextProps.nextSteps.length && nextProps.conversationStarted
		}
		return {
			visible: conditions[currentState.askFeedbackTime] && !feedbackAlreadyAsked
		}
	}
	componentDidMount() {
		this.setState({
			askFeedbackTime:
				Math.random() > 0.5
					? 'AFTER_SIMULATION_COMPLETED'
					: 'AFTER_FIRST_ESTIMATE'
		})
	}

	handleClose = () => {
		this.setState({ visible: false })
		this.setCookie()
	}
	setCookie = () => {
		document.cookie = 'feedback_asked=true;'
	}
	onSmileyClick = satisfaction => {
		ReactPiwik.push(['trackEvent', 'feedback', 'smiley', satisfaction])
		this.setState({ showForm: true, satisfaction, visible: false })
		this.setCookie()
	}
	render() {
		let { satisfaction, showForm, visible, askFeedbackTime } = this.state,
			{ language } = this.props

		return (
			<>
				{showForm && (
					<TypeFormEmbed
						hiddenVariables={{
							exterieur: false,
							satisfaction,
							answertiming: askFeedbackTime,
							language
						}}
					/>
				)}
				<ReactCSSTransitionGroup
					transitionName="slide-blurred-bottom"
					transitionEnterTimeout={2800}
					transitionLeaveTimeout={300}>
					{visible && (
						<div className="sondage__container">
							<div className="sondage">
								<span className="sondage__text">
									<Trans>Votre avis nous intéresse !</Trans>
								</span>
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
								<button
									className="sondage__closeButton unstyledButton"
									onClick={this.handleClose}
									aria-label="close">
									X
								</button>
							</div>
						</div>
					)}
				</ReactCSSTransitionGroup>
			</>
		)
	}
}
