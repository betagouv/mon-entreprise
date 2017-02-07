import React, { Component } from 'react'
import './CDD.css'
import IntroCDD from './IntroCDD'
import Results from './Results'
import {reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import './conversation/conversation.css'
import {START_CONVERSATION} from '../actions'

@connect(({form: {conversation}, steps}) => ({conversationState: conversation && conversation.values, steps}))
class Aide extends Component {
	render() {
		let {steps, conversationState} = this.props
		if (!steps.length) return null
		let [{dependencyOfVariables, helpText}] = steps
		return <section id="help">
			{/*
			{helpText}
			<div className="dependency-of">
				Cette question est nécessaire pour calculer :
				<ul>
					{dependencyOfVariables.map(v =>
						<li key={v}>{v}</li>
					)}
				</ul>
			</div>
			*/}
		</section>
	}
}
let situationSelector = formValueSelector('conversation')

@reduxForm(
	{form: 'conversation'}
)
@connect(state => ({
	situation: variableName => situationSelector(state, variableName),
	steps: state.steps,
	themeColours: state.themeColours,
	analysedSituation: state.analysedSituation
}), dispatch => ({
	startConversation: () => dispatch({type: START_CONVERSATION})
}))
export default class CDD extends Component {
	componentDidMount() {
		this.props.startConversation()
	}
	render() {

		let {steps} = this.props

		let conversation = steps.map(step =>
			<step.component key={step.name} {...step}/>
		)

		return (
			<div id="sim">
				<IntroCDD />
				<div id="conversation">
					<section id="questions-answers">
						{conversation}
					</section>
					<Aide />
				</div>
				<Results {...this.props}/>
			</div>
		)
	}
}

/* TODO Problèmes à résoudre :

- exprimer la justification du CDD d'usage au delà des secteurs.
" l'usage exclut le recours au CDI en raison de la nature de l'activité et du caractère temporaire de ces emplois."
+ interdictions explicites (grève et travaux dangereux)

*/
