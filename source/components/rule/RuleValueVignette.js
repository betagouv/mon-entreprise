import React, { Component } from 'react'
import withLanguage from '../withLanguage'
import { Link } from 'react-router-dom'
import { encodeRuleName } from 'Engine/rules'

import './RuleValueVignette.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

let RuleValueVignette = ({ name, title, nodeValue: ruleValue }) => (
	<span key={name} className="RuleValueVignette">
		<Link to={'/règle/' + encodeRuleName(name)}>
			<div className="rule-box">
				<span className="rule-name">{title}</span>
				<RuleValue ruleValue={ruleValue} />
			</div>
		</Link>
	</span>
)

@withLanguage
export class RuleValue extends Component {
	render() {
		let { value, language } = this.props
		let unsatisfied = value == null,
			irrelevant = value == 0
		let [className, text] = irrelevant
			? ['irrelevant', '0']
			: unsatisfied
				? ['unsatisfied', '']
				: [
						'figure',
						Intl.NumberFormat(language, {
							style: 'currency',
							currency: 'EUR',
							maximumFractionDigits: 0,
							minimumFractionDigits: 0
						}).format(value)
				  ]
		return (
			<ReactCSSTransitionGroup
				transitionName="flash"
				transitionEnterTimeout={100}
				transitionLeaveTimeout={100}>
				<span key={text} className="Rule-value">
					{' '}
					<span className={className}>
						{this.props.target.title === 'Salaire chargé' ? (
							<span>3542€ - 🎁 200€ </span>
						) : (
							<span>{text}</span>
						)}
					</span>
				</span>
			</ReactCSSTransitionGroup>
		)
	}
}

export default RuleValueVignette
