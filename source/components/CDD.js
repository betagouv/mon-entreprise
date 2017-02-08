import React, { Component } from 'react'
import './CDD.css'
import IntroCDD from './IntroCDD'
import Results from './Results'
import {reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import './conversation/conversation.css'
import {START_CONVERSATION} from '../actions'
import {findRuleByName} from '../engine/rules'

@connect(({form: {conversation}, steps, explainTerm}) => ({conversationState: conversation && conversation.values, steps, explainTerm}))
class Aide extends Component {
	render() {
		let {steps, conversationState, explainTerm} = this.props
		if (!steps.length) return null
		let [{dependencyOfVariables, helpText}] = steps

		if (!explainTerm) return <section id="help" />

		let rule = findRuleByName(explainTerm),
			text = rule.description || rule.titre

		let possibilities = rule['choix exclusifs']

		return (
			<section id="help" className="active">
				<p>
					{text}
				</p>
				{ possibilities &&
					<p>
						{possibilities.length} possibilités :
						<ul>
							{possibilities.map(p =>
								<li key={p}>{p}</li>
							)}
						</ul>
					</p>
				}
			</section>
		)
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
