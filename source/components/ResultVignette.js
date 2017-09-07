import React from "react"
import {Link} from 'react-router-dom'
import {computeRuleValue} from 'Engine/traverse'
import {encodeRuleName} from 'Engine/rules'
import R from 'ramda'
import classNames from 'classnames'
import {capitalise0} from '../utils'
let fmt = new Intl.NumberFormat('fr-FR').format
let humanFigure = decimalDigits => value => fmt(value.toFixed(decimalDigits))
import './ResultVignette.css'

export default ({
	name,
	dottedName,
	type,
	"non applicable si": nonApplicable,
	formule: { nodeValue: formuleValue },
	conversationStarted
}) =>
	do {
		//TODO quel bordel, à revoir
		let ruleValue = computeRuleValue(
				formuleValue,
				nonApplicable && nonApplicable.nodeValue
			),
			unsatisfied = ruleValue == null,
			nonApplicableValue = nonApplicable ? nonApplicable.nodeValue : false,
			irrelevant = nonApplicableValue === true || formuleValue == 0,
			number = nonApplicableValue == false && formuleValue != null

		;
		<span
			key={name}
			className={classNames('ResultVignette', { unsatisfied, irrelevant, number })}
		>
			<Link to={"/regle/" + encodeRuleName(name)}>
				<div className="rule-type">
					{type}
				</div>
				<div className="rule-box">
					<div className="rule-name">
						{capitalise0(name)}
					</div>
					<p>
						{conversationStarted &&
							(irrelevant
								? "Vous n'êtes pas concerné"
								: unsatisfied
									? "En attente de vos réponses..."
									: <span className="figure">
										{humanFigure(2)(formuleValue) + "€"}
									</span>)}
					</p>
				</div>
			</Link>
		</span>
	}
