import React, { Component } from 'react'
import './Sondage.css'
import { connect } from 'react-redux'
import ReactPiwik from './Tracker'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Smiley from './SatisfactionSmiley'
import TypeFormEmbed from './TypeFormEmbed'
import PropTypes from 'prop-types'
import { Trans, translate } from 'react-i18next'

@connect(state => ({
	targets: state.analysis ? state.analysis.targets : [],
	activeInput: state.activeTargetInput,
	currentQuestion: state.currentQuestion,
	conversationStarted: state.conversationStarted
}))
@translate()
export default class Sondage extends Component {
	state = {
		visible: false,
		showForm: false,
		askFeedbackTime: 'AFTER_FIRST_ESTIMATE'
	}
	static contextTypes = {
		i18n: PropTypes.object.isRequired
	}
	static getDerivedStateFromProps(nextProps, currentState) {
		let feedbackAlreadyAsked = !!document.cookie.includes('feedback_asked=true')
		let conditions = {
			AFTER_FIRST_ESTIMATE: nextProps.activeInput && nextProps.targets.length,
			AFTER_SIMULATION_COMPLETED:
				!nextProps.currentQuestion && nextProps.conversationStarted
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
		let { satisfaction, showForm, visible, askFeedbackTime } = this.state

		return (
			<>
				{showForm && (
					<TypeFormEmbed
						hiddenVariables={{
							exterieur: false,
							satisfaction,
							answertiming: askFeedbackTime,
							language: this.context.i18n.language
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
