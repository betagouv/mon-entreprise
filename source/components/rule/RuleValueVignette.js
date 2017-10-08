import React from "react"
import {Link} from 'react-router-dom'
import {encodeRuleName} from 'Engine/rules'
import classNames from 'classnames'
import {capitalise0} from '../../utils'
let fmt = new Intl.NumberFormat('fr-FR').format
export let humanFigure = decimalDigits => value => fmt(value.toFixed(decimalDigits))
import './RuleValueVignette.css'

export default ({
	name,
	type,
	titre,
	conversationStarted,
	nodeValue: ruleValue
}) =>
	do {
		let
			unsatisfied = ruleValue == null,
			irrelevant = ruleValue == 0,
			number = typeof ruleValue == 'number' && ruleValue > 0

		;<span
			key={name}
			className={classNames('RuleValueVignette', { unsatisfied, irrelevant, number })}
		>
			<Link to={"/regle/" + encodeRuleName(name)}>
				<div className="rule-type">
					{type}
				</div>
				<div className="rule-box">
					<div className="rule-name">
						{titre || capitalise0(name)}
					</div>
					<p>
						{conversationStarted &&
							(irrelevant
								? "Vous n'êtes pas concerné"
								: unsatisfied
									? "En attente de vos réponses..."
									: <div><span className="figure">
										{humanFigure(2)(ruleValue) + "€"}
									</span>
									<p><i className="fa fa-lightbulb-o" aria-hidden="true"></i><em>Pourquoi ?</em></p>
									</div>)}
					</p>
				</div>
			</Link>
		</span>
	}
