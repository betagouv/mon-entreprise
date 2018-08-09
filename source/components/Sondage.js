import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import {
	nextStepsSelector,
	noUserInputSelector
} from 'Selectors/analyseSelectors'
import Smiley from './SatisfactionSmiley'
import './Sondage.css'
import ReactPiwik from './Tracker'
import TypeFormEmbed from './TypeFormEmbed'
import { LinkButton } from 'Ui/Button'
import withColours from 'Components/utils/withColours'
import withLanguage from 'Components/utils/withLanguage'

@connect(state => ({
	conversationStarted: state.conversationStarted,
	noUserInput: noUserInputSelector(state),
	nextSteps: nextStepsSelector(state)
}))
@translate()
@withLanguage
@withColours
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
			{
				language,
				colours: { colour }
			} = this.props

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
					transitionEnterTimeout={6800}
					transitionLeaveTimeout={300}>
					{visible && (
						<div className="sondage__container">
							<div
								className="sondage"
								style={{ color: colour, borderColor: colour }}>
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
								<LinkButton
									className="sondage__closeButton"
									onClick={this.handleClose}
									aria-label="close">
									X
								</LinkButton>
							</div>
						</div>
					)}
				</ReactCSSTransitionGroup>
			</>
		)
	}
}
