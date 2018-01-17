import React from 'react'
import { Link } from 'react-router-dom'
import { encodeRuleName } from 'Engine/rules'
import classNames from 'classnames'
let fmt = new Intl.NumberFormat('fr-FR').format
export let humanFigure = decimalDigits => value =>
	fmt(value.toFixed(decimalDigits))
import './RuleValueVignette.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default ({
	name,
	type,
	title,
	conversationStarted,
	nodeValue: ruleValue,
	newValue
}) =>
	do {
		console.log(newValue)
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
			<Link to={'/regle/' + encodeRuleName(name)}>
				<div className="rule-box">
					<span className="rule-name">{title}</span>
					<RuleValue
						{...{
							unsatisfied,
							irrelevant,
							conversationStarted,
							ruleValue,
							newValue
						}}
					/>
				</div>
			</Link>
		</span>
	}

let RuleValue = ({
	unsatisfied,
	irrelevant,
	conversationStarted,
	ruleValue,
	newValue
}) =>
	do {
		let [className, text] = irrelevant
			? ['irrelevant', "Vous n'êtes pas concerné"]
			: unsatisfied
				? ['unsatisfied', 'En attente de vos réponses...']
				: [
						'figure',
						humanFigure(0)(ruleValue) +
							' €' +
							(typeof newValue === 'number'
								? ` + ${humanFigure(0)(newValue - ruleValue)}`
								: '')
					]

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
				{conversationStarted && <span className={className}>{text}</span>}
			</span>
		</ReactCSSTransitionGroup>
	}
