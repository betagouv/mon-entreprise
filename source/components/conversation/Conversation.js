import React, { Component } from 'react'
import R from 'ramda'
import Aide from '../Aide'
import Satisfaction from '../Satisfaction'
import { scroller, Element } from 'react-scroll'


export default class Conversation extends Component {
	componentWillReceiveProps(nextProps) {
		if (nextProps.foldedSteps.length == this.props.foldedSteps.length)
			return null

		setTimeout(
			() =>
				scroller.scrollTo('myScrollToElement', {
					duration: 200,
					delay: 0,
					smooth: true
				}),
			1
		)
	}
	render() {
		let {
			foldedSteps,
			currentQuestion,
			reinitalise,
			textColourOnWhite,
			done,
			nextSteps
		} = this.props

		return (
			<>{!R.isEmpty(foldedSteps) && (
				<div id="foldedSteps">
					<div className="header">
						<button
							onClick={reinitalise}
							style={{ color: textColourOnWhite }}
						>
							<i className="fa fa-trash" aria-hidden="true" />
								Tout effacer
						</button>
					</div>
					{foldedSteps}
				</div>
			)}<Element name="myScrollToElement" id="myScrollToElement">
				<h3
					className="scrollIndication up"
					style={{ opacity: foldedSteps.length != 0 ? 1 : 0 }}
				>
					<i className="fa fa-long-arrow-up" aria-hidden="true" /> Modifier
						mes réponses
				</h3>
				<div id="currentQuestion">
					{currentQuestion || <Satisfaction simu={this.props.simu} />}
				</div>
			</Element>
			<Aide />
		</>
		)
	}
}
