import React from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import { encodeRuleName } from 'Engine/rules'
import classNames from 'classnames'
import { humanFigure } from '../../utils'

import './RuleValueVignette.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default ({
	name,
	type,
	conversationStarted,
	flatRule,
	nodeValue: ruleValue
}) =>
	do {
		let unsatisfied = ruleValue == null,
			irrelevant = ruleValue == 0,
			number = typeof ruleValue == 'number' && ruleValue > 0
		;<span
			key={name}
			className={classNames('RuleValueVignette', {
				unsatisfied,
				irrelevant,
				number
			})}
		>
			<Link to={'/règle/' + encodeRuleName(name)}>
				<div className="rule-box">
					<span className="rule-name">{flatRule.title}</span>
					<RuleValue
						{...{ unsatisfied, irrelevant, conversationStarted, ruleValue }}
					/>
				</div>
			</Link>
		</span>
	}

let RuleValue = ({ unsatisfied, irrelevant, conversationStarted, ruleValue }) =>
	do {
		let [className, text] = irrelevant
			? ['irrelevant', "Vous n'êtes pas concerné"]
			: unsatisfied
				? ['unsatisfied', 'En attente de vos réponses...']
				: ['figure', humanFigure(0)(ruleValue) + ' €']

		{
			/*<p><i className="fa fa-lightbulb-o" aria-hidden="true"></i><em>Pourquoi ?</em></p> */
		}

		;<ReactCSSTransitionGroup
			transitionName="flash"
			transitionEnterTimeout={100}
			transitionLeaveTimeout={100}
		>
			<span key={text} className="rule-value">
				{' '}
				{conversationStarted && <span className={className}><Trans i18nKey={className}>{text}</Trans></span>}
			</span>
		</ReactCSSTransitionGroup>
	}
