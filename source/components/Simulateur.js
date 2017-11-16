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
import Conversation from './conversation/Conversation'
import { makeQuestion } from 'Engine/generateQuestions'

import ReactPiwik from './Tracker'

import Results from 'Components/Results'

@withRouter
@connect(
	state => ({
		currentQuestion: state.currentQuestion,
		foldedSteps: state.foldedSteps,
		extraSteps: state.extraSteps,
		themeColours: state.themeColours,
		situationGate: state.situationGate,
		targetNames: state.targetNames
	}),
	dispatch => ({
		startConversation: targetNames =>
			dispatch({ type: START_CONVERSATION, targetNames}),
		resetForm: () => dispatch(reset('conversation'))
	})
)
export default class extends Component {
	state = {
		started: false
	}
	componentWillMount() {
		let { match: { params: { targets: encodedTargets} } } = this.props,
			targetNames = encodedTargets.split('+').map(decodeRuleName)

		this.targetNames = targetNames
		this.targetRules = targetNames.map(name => findRuleByName(rules, name))

		// C'est ici que la génération du formulaire, et donc la traversée des variables commence
		// if (!existingConversation)
		//TODO
		this.props.startConversation(targetNames)
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
				themeColours,
				targetNames
			} = this.props,
			reinitalise = () => {
				ReactPiwik.push(['trackEvent', 'restart', ''])
				this.props.resetForm(this.name)
				this.props.startConversation(this.targets)
			}

		return (
			<div id="sim">
				<Helmet>
					<title>Titre à mettre</title>
				</Helmet>
				<h1>Titre et sous titres à mettre</h1>
				<Results />
				<Conversation
					{...{
						reinitalise,
						currentQuestion:
							currentQuestion &&
							this.buildStep({ unfolded: true })(situationGate, targetNames)(currentQuestion),
						foldedSteps: R.map(
							this.buildStep({ unfolded: false })(situationGate, targetNames),
							foldedSteps
						),
						extraSteps: R.map(
							this.buildStep({ unfolded: true })(situationGate, targetNames),
							extraSteps
						),
						textColourOnWhite: themeColours.textColourOnWhite
					}}
				/>
			</div>
		)
	}

	buildStep = ({ unfolded }) => (accessor, targetNames) => question => {
		let step = makeQuestion(rules, targetNames)(question)
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
