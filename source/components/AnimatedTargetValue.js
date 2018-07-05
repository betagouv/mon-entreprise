import React, { Component } from 'react'
import withLanguage from './withLanguage'

import './AnimatedTargetValue.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

@withLanguage
class AnimatedTargetValue extends Component {
	render() {
		let { value, language } = this.props
		let formattedValue =
			value == null
				? ''
				: Intl.NumberFormat(language, {
						style: 'currency',
						currency: 'EUR',
						maximumFractionDigits: 0,
						minimumFractionDigits: 0
				  }).format(value)
		return (
			<ReactCSSTransitionGroup
				transitionName="flash"
				transitionEnterTimeout={100}
				transitionLeaveTimeout={100}>
				<span key={value} className="Rule-value">
					{' '}
					<span>{formattedValue}</span>
				</span>
			</ReactCSSTransitionGroup>
		)
	}
}

export default AnimatedTargetValue
