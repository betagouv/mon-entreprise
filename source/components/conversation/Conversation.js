import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { isEmpty } from 'ramda'
import Aide from '../Aide'
import Satisfaction from '../Satisfaction'
import { reduxForm } from 'redux-form'
import { scroller, Element } from 'react-scroll'

let scroll = () =>
	scroller.scrollTo('myScrollToElement', {
		duration: 500,
		delay: 0,
		smooth: true
	})

@reduxForm({
	form: 'conversation',
	destroyOnUnmount: false
})
@translate()
export default class Conversation extends Component {
	componentWillReceiveProps(nextProps) {
		if (nextProps.foldedSteps.length == this.props.foldedSteps.length)
			return null

		setTimeout(scroll, 1) // scrolling after the first answer doesn't work
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
			<>
				{!isEmpty(foldedSteps) && (
					<div id="foldedSteps">
						<div className="header">
							<button
								onClick={reinitalise}
								style={{ color: textColourOnWhite }}
							>
								<i className="fa fa-trash" aria-hidden="true" />
								<Trans i18nKey="resetAll">Tout effacer</Trans>
							</button>
						</div>
						{foldedSteps}
					</div>
				)}
				<Element name="myScrollToElement" id="myScrollToElement">
					<h3
						className="scrollIndication up"
						style={{
							opacity: foldedSteps.length != 0 ? 1 : 0,
							color: textColourOnWhite
						}}
					>
						<i className="fa fa-long-arrow-up" aria-hidden="true" />
						<Trans i18nKey="change">Modifier mes réponses</Trans>
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
