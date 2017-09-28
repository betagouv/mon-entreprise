import React, { Component } from 'react'
import R from 'ramda'
import Aide from '../Aide'
import Satisfaction from '../Satisfaction'
import {reduxForm} from 'redux-form'

@reduxForm({
	form: "conversation",
	destroyOnUnmount: false
})
export default class Conversation extends Component {
	render() {
		let {foldedSteps, unfoldedSteps, extraSteps, reinitalise, situation, situationGate} = this.props
		window.scrollTo(0,document.body.scrollHeight)
		return (
			<div id="conversation">
				<div id="questions-answers">
					{ !R.isEmpty(foldedSteps) &&
						<div id="foldedSteps">
							<div className="header" >
								<h3>Vos réponses</h3>
								<button onClick={reinitalise}>
									<i className="fa fa-trash" aria-hidden="true"></i>
									Tout effacer
								</button>
							</div>
							{foldedSteps
								.map(step => (
									<step.component
										key={step.name}
										{...step}
										step={step}
										answer={situation(step.name)}
									/>
								))}
						</div>
					}
					{ !R.isEmpty(extraSteps) &&
						<div id="foldedSteps">
							<div className="header" >
								<h3>Affiner votre situation</h3>
							</div>
							{extraSteps
								.map(step => (
									<step.component
										key={step.name}
										{...step}
										step={step}
										answer={situationGate(step.name)}
									/>
								))}
						</div>
					}
					<div id="unfoldedSteps">
						{ !R.isEmpty(unfoldedSteps) && do {
							let step = R.head(unfoldedSteps)
							;<step.component
								key={step.name}
								step={R.dissoc('component', step)}
								unfolded={true}
								answer={situation(step.name)}
							/>
						}}
					</div>
					{unfoldedSteps.length == 0 &&
						<Conclusion simu={this.name}/>}
				</div>
				<Aide />
			</div>
		)
	}
}


class Conclusion extends Component {
	render() {
		return (
			<div id="fin">
				<img src={require('../../images/fin.png')} />
				<div id="fin-text">
					<p>
						Votre simulation est terminée !
					</p>
					<p>
						N'hésitez pas à modifier vos réponses, ou cliquez sur vos résultats pour comprendre le calcul.
					</p>
					<Satisfaction simu={this.props.simu}/>
				</div>
			</div>
		)
	}
}
