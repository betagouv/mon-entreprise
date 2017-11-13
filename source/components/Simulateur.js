import R from 'ramda'
import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { reset } from 'redux-form'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'
import classNames from 'classnames'

import { START_CONVERSATION } from '../actions'
import { rules, findRuleByName, decodeRuleName } from 'Engine/rules'
import './conversation/conversation.css'
import './Simulateur.css'
import { capitalise0 } from '../utils'
import Conversation from './conversation/Conversation'
import { makeQuestion } from 'Engine/generateQuestions'

import ReactPiwik from './Tracker'

@withRouter
@connect(
	state => ({
		currentQuestion: state.currentQuestion,
		foldedSteps: state.foldedSteps,
		extraSteps: state.extraSteps,
		themeColours: state.themeColours,
		situationGate: state.situationGate
	}),
	dispatch => ({
		startConversation: (targetNames, firstInput) =>
			dispatch({ type: START_CONVERSATION, targetNames, firstInput}),
		resetForm: () => dispatch(reset('conversation'))
	})
)
export default class extends Component {
	state = {
		started: false
	}
	componentWillMount() {
		let { match: { params: { targets: encodedTargets, firstInput: encodedFirstInput } } } = this.props,
			targetNames = encodedTargets.split('+').map(decodeRuleName),
			existingConversation = this.props.foldedSteps.length > 0

		this.targetNames = targetNames
		this.targetRules = targetNames.map(name => findRuleByName(rules, name))
		this.firstInput = findRuleByName(rules, decodeRuleName(encodedFirstInput)).dottedName

		// C'est ici que la génération du formulaire, et donc la traversée des variables commence
		// if (!existingConversation)
		//TODO
		this.props.startConversation(targetNames, this.firstInput)
	}
	render() {
		//TODO
		// if (!this.targets.formule && !R.path(['simulateur', 'objectifs'], this.rule))
		// 	return <Redirect to={'/regle/' + this.name} />

		let {
				foldedSteps,
				extraSteps,
				currentQuestion,
				situationGate,
				themeColours
			} = this.props,
			reinitalise = () => {
				ReactPiwik.push(['trackEvent', 'restart', ''])
				this.props.resetForm(this.name)
				this.props.startConversation(this.targets, this.firstInput)
			}

		return (
			<div id="sim">
				<Helmet>
					<title>Titre à mettre</title>
				</Helmet>
				<h1>Titre et sous titres à mettre TODO</h1>

				<Conversation
					{...{
						reinitalise,
						currentQuestion:
							currentQuestion &&
							this.buildStep({ unfolded: true })(situationGate)(currentQuestion),
						foldedSteps: R.map(
							this.buildStep({ unfolded: false })(situationGate),
							foldedSteps
						),
						extraSteps: R.map(
							this.buildStep({ unfolded: true })(situationGate),
							extraSteps
						),
						textColourOnWhite: themeColours.textColourOnWhite
					}}
				/>
			</div>
		)
	}

	buildStep = ({ unfolded }) => accessor => question => {
		let step = makeQuestion(rules)(question)
		return (
			<step.component
				key={step.name}
				{...step}
				unfolded={unfolded}
				step={step}
				answer={accessor(step.name)}
			/>
		)
	}
}
