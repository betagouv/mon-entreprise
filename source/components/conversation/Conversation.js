import React, { Component } from 'react'
import R from 'ramda'
import Aide from '../Aide'
import Satisfaction from '../Satisfaction'
import {reduxForm} from 'redux-form'
import Scroll from 'react-scroll'

@reduxForm({
	form: 'conversation',
	destroyOnUnmount: false
})
export default class Conversation extends Component {
	render() {
		let {foldedSteps, currentQuestion, reinitalise, textColourOnWhite} = this.props

		Scroll.animateScroll.scrollToBottom()
		return (
			<div id="conversation">
				<div id="questions-answers">
					{ !R.isEmpty(foldedSteps) &&
						<div id="foldedSteps">
							<div className="header" >
								<h2><i className="fa fa-mouse-pointer" aria-hidden="true"></i>Vos réponses</h2>
								<button onClick={reinitalise} style={{color: textColourOnWhite}}>
									<i className="fa fa-trash" aria-hidden="true"></i>
									Tout effacer
								</button>
							</div>
							{foldedSteps}
						</div>
					}
					{!currentQuestion &&
						<Conclusion affiner={!R.isEmpty({})}/>}
					{ !R.isEmpty({}) &&
						<div id="foldedSteps">
							<div className="header" >
								<h3>Affiner votre situation</h3>
							</div>
							{}
						</div>
					}
					<div id="currentQuestion">
						{ currentQuestion || <Satisfaction simu={this.props.simu}/>}
					</div>
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
