import React, {Component} from 'react'
import './CDD.css'
import Results from './Results'
import {reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import './conversation/conversation.css'
import {START_CONVERSATION} from '../actions'
import Aide from './Aide'
import PageTypeIcon from './PageTypeIcon'

let situationSelector = formValueSelector('conversation')

@reduxForm({form: 'conversation', destroyOnUnmount: false})
@connect(
	state => ({
		situation: variableName => situationSelector(state, variableName),
		steps: state.submittedSteps.concat(state.steps),
		themeColours: state.themeColours,
		analysedSituation: state.analysedSituation,
	}),
	dispatch => ({
		startConversation: () => dispatch({type: START_CONVERSATION}),
	}),
)
export default class CDD extends Component {
	componentDidMount() {
		this.props.startConversation()
	}
	render() {
		let {steps, situation} = this.props

		let conversation = steps.map(step => (
			<step.component key={step.name} {...step} step={step} answer={situation(step.name)}/>
		))

		return (
			<div id="sim">
				<PageTypeIcon type="simulation" />
				<h1>Simulateur CDD</h1>
				<div id="conversation">
					<section id="questions-answers">
						{conversation}
					</section>
					<Aide />
				</div>
				<Results {...this.props} />
			</div>
		)
	}
}

/* TODO Problèmes à résoudre :

- exprimer la justification du CDD d'usage au delà des secteurs.
" l'usage exclut le recours au CDI en raison de la nature de l'activité et du caractère temporaire de ces emplois."
+ interdictions explicites (grève et travaux dangereux)

*/
