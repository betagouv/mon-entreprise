import React from 'react'
import { Link } from 'react-router-dom'
import { encodeRuleName } from 'Engine/rules'
import classNames from 'classnames'
import { humanFigure } from '../../utils'

import './RuleValueVignette.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default ({ name, type, title, nodeValue: ruleValue }) => (
	<span key={name} className="RuleValueVignette">
		<Link to={'/règle/' + encodeRuleName(name)}>
			<div className="rule-box">
				<span className="rule-name">{title}</span>
				<RuleValue ruleValue={ruleValue} />
			</div>
		</Link>
	</span>
)

export let RuleValue = ({ value }) =>
	do {
		let unsatisfied = value == null,
			irrelevant = value == 0
		let [className, text] = irrelevant
			? ['irrelevant', '0']
			: unsatisfied ? ['unsatisfied', ''] : ['figure', humanFigure(0)(value)]
		;<ReactCSSTransitionGroup
			transitionName="flash"
			transitionEnterTimeout={100}
			transitionLeaveTimeout={100}
		>
			<span key={text} className="Rule-value">
				{' '}
				<span className={className}>{text}</span>
			</span>
		</ReactCSSTransitionGroup>
	}
