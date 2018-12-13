import withLanguage from 'Components/utils/withLanguage'
import { encodeRuleName } from 'Engine/rules'
import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Link } from 'react-router-dom'
import './RuleValueVignette.css'

let RuleValueVignette = ({ name, title, value: ruleValue }) => (
	<span key={name} className="RuleValueVignette">
		<Link to={'../règle/' + encodeRuleName(name)}>
			<div className="rule-box">
				<span className="rule-name">{title}</span>
				<RuleValue ruleValue={ruleValue} />
			</div>
		</Link>
	</span>
)

export const RuleValue = withLanguage(
	class RuleValue extends Component {
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
						<span className={className}>{text}</span>
					</span>
				</ReactCSSTransitionGroup>
			)
		}
	}
)

export default RuleValueVignette
