import React, { Component } from 'react'
import R from 'ramda'
import Aide from '../Aide'
import Satisfaction from '../Satisfaction'
import {reduxForm} from 'redux-form'
import Scroll from 'react-scroll'

@reduxForm({
	form: "conversation",
	destroyOnUnmount: false
})
export default class Conversation extends Component {
	render() {
		let {foldedSteps, unfoldedSteps, extraSteps, reinitalise, situation, situationGate, textColourOnWhite} = this.props

		Scroll.animateScroll.scrollToBottom()
		return (
			<div id="conversation">
				<div id="questions-answers">
					{ !R.isEmpty(foldedSteps) &&
						<div id="foldedSteps">
							<div className="header" >
								<h3>Vos réponses</h3>
								<button onClick={reinitalise} style={{color: textColourOnWhite}}>
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
					{unfoldedSteps.length == 0 &&
						<Conclusion affiner={!R.isEmpty(extraSteps)}/>}
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
					{R.isEmpty(unfoldedSteps) &&
						<Satisfaction simu={this.props.simu}/>
					}
				</div>
				<Aide />
			</div>
		)
	}
}

let Conclusion = ({ affiner }) => (
	<div id="fin">
		<p>
			Vous pouvez maintenant modifier vos réponses{" "}
			{affiner && "ou affiner votre situation"} : vos résultats ci-dessous seront mis à jour.
		</p>
	</div>
)
