import { reject, isNil, equals, pluck, path, map, omit } from 'ramda'
import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { reset, change, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'
import classNames from 'classnames'
import { START_CONVERSATION } from '../actions'
import {
	findRuleByName,
	findRule,
	findRuleByDottedName,
	decodeRuleName
} from 'Engine/rules'
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
		analysis: state.analysis,
		parsedRules: state.parsedRules
	}),
	dispatch => ({
		startConversation: (targetNames, fromScratch = false) =>
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
				resetFormField,
				parsedRules
			} = this.props,
			targetNames = encodedTargets.split('+').map(decodeRuleName)

		this.targetNames = targetNames

		this.targetRules = reject(isNil)(
			targetNames.map(name => findRule(parsedRules, name))
		)

		this.targetRules.map(({ dottedName }) => resetFormField(dottedName))

		if (
			this.targetRules.length > 0 &&
			(this.props.foldedSteps.length === 0 ||
				!equals(targetNames, pastTargetNames))
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
				inputInversions,
				done
			} = this.props,
			reinitalise = () => {
				ReactPiwik.push(['trackEvent', 'restart', ''])
				this.props.resetForm()
				this.props.startConversation(this.targetNames, true)
			},
			noQuestionsLeft = currentQuestion == null

		return (
			<div id="sim" className={classNames({ noQuestionsLeft })}>
				<Helmet>
					<title>
						{"Simulateur d'embauche : "}
						{pluck('title', this.targetRules).join(', ')}
					</title>
					<meta
						name="description"
						content={pluck('description', this.targetRules).join(' - ')}
					/>
				</Helmet>
				<Conversation
					{...{
						reinitalise,
						currentQuestion:
							currentQuestion &&
							this.buildStep({ unfolded: true })(
								situationGate,
								this.targetNames,
								inputInversions
							)(currentQuestion),
						foldedSteps: map(
							this.buildStep({ unfolded: false })(
								situationGate,
								this.targetNames,
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
				{done && (
					<Explanation
						targetRules={path(['analysis', 'targets'], this.props)}
					/>
				)}
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
				(inputInversions &&
					path(step.dottedName.split('.'), inputInversions)) ||
				step.dottedName,
			fieldTitle = findRuleByDottedName(rules, fieldName).title

		return (
			<step.component
				key={step.dottedName}
				{...omit('component', step)}
				unfolded={unfolded}
				step={omit('component', step)}
				situationGate={situationGate}
				fieldName={fieldName}
				fieldTitle={fieldTitle}
				inverted={step.dottedName !== fieldName}
			/>
		)
	}
}
