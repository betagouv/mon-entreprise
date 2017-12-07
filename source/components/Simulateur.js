import R from 'ramda'
import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { reset, change, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'

import { START_CONVERSATION } from '../actions'
import { rules, findRuleByName, decodeRuleName } from 'Engine/rules'
import './conversation/conversation.css'
import './Simulateur.css'
import Conversation from './conversation/Conversation'
import { makeQuestion } from 'Engine/generateQuestions'

import ReactPiwik from './Tracker'

import Results from 'Components/Results'
import Explanation from 'Components/Explanation'

@withRouter
@connect(
	state => ({
		currentQuestion: state.currentQuestion,
		foldedSteps: state.foldedSteps,
		themeColours: state.themeColours,
		situationGate: state.situationGate,
		targetNames: state.targetNames,
		done: state.done,
		nextSteps: state.nextSteps,
		inputInversions: formValueSelector('conversation')(state, 'inversions'),
		analysis: state.analysis
	}),
	dispatch => ({
		startConversation: (targetNames, fromScratch=false) =>
			dispatch({ type: START_CONVERSATION, targetNames, fromScratch }),
		resetForm: () => dispatch(reset('conversation')),
		resetFormField: name => dispatch(change('conversation', name, ''))
	})
)
export default class extends Component {
	state = {
		started: false
	}
	componentWillMount() {
		let {
				match: { params: { targets: encodedTargets } },
				targetNames: pastTargetNames,
				resetFormField
			} = this.props,
			targetNames = encodedTargets.split('+').map(decodeRuleName)

		this.targetNames = targetNames
		this.targetRules = R.reject(R.isNil)(
			targetNames.map(name => findRuleByName(rules, name))
		)

		this.targetRules.map(({ dottedName }) => resetFormField(dottedName))

		if (
			this.targetRules.length > 0 &&
			(this.props.foldedSteps.length === 0 ||
				!R.equals(targetNames, pastTargetNames))
		)
			this.props.startConversation(targetNames)
	}
	render() {
		if (this.targetRules.length == 0) return <Redirect to="/404" />

		let {
				foldedSteps,
				currentQuestion,
				situationGate,
				themeColours,
				targetNames,
				inputInversions
			} = this.props,
			reinitalise = () => {
				ReactPiwik.push(['trackEvent', 'restart', ''])
				this.props.resetForm()
				this.props.startConversation(this.targetNames, true)
			}

		return (
			<div id="sim">
				<Helmet>
					<title>
						{'Simulateur d\'embauche : '}
						{R.pluck('title', this.targetRules).join(', ')}
					</title>
					<meta
						name="description"
						content={R.pluck('description', this.targetRules).join(' - ')}
					/>
				</Helmet>
				<Conversation
					{...{
						reinitalise,
						currentQuestion:
							currentQuestion &&
							this.buildStep({ unfolded: true })(
								situationGate,
								targetNames,
								inputInversions
							)(currentQuestion),
						foldedSteps: R.map(
							this.buildStep({ unfolded: false })(
								situationGate,
								targetNames,
								inputInversions
							),
							foldedSteps
						),
						done: this.props.done,
						nextSteps: this.props.nextSteps,
						textColourOnWhite: themeColours.textColourOnWhite
					}}
				/>
				<Results />
				<Explanation targetRules={R.path(['analysis', 'targets'], this.props)}/>
			</div>
		)
	}

	buildStep = ({ unfolded }) => (
		situationGate,
		targetNames,
		inputInversions
	) => question => {
		let step = makeQuestion(rules, targetNames)(question)

		let fieldName =
			(unfolded &&
				inputInversions &&
				R.path(step.dottedName.split('.'), inputInversions)) ||
			step.dottedName

		return (
			<step.component
				key={step.dottedName}
				{...step}
				unfolded={unfolded}
				step={step}
				situationGate={situationGate}
				fieldName={fieldName}
				inverted={step.dottedName !== fieldName}
			/>
		)
	}
}
