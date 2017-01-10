import React, { Component } from 'react'
import {answered} from './userAnswerButtonStyle'


export default class StepAnswer extends Component {
	render() {
		let {
			value, human, valueType, ignored, themeColours
		} = this.props,
		// Show a beautiful answer to the user, rather than the technical form value
			humanFunc = human || valueType && valueType.human || (v => v)

		return (
			<span key="1" className="resume" style={answered(themeColours)} >
				{humanFunc(value)}
				{ignored && <span className="answer-ignored">(défaut)</span>}
			</span>
		)
	}
}
