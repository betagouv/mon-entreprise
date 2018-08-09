import { encodeRuleName, findRuleByDottedName } from 'Engine/rules'
import React from 'react'
import { Link } from 'react-router-dom'
import { capitalise0 } from '../../utils'
import './Namespace.css'

let Namespace = ({ ns, flatRules }) => (
	<ul id="namespace">
		{ns
			.split(' . ')
			.reduce(
				(memo, next) => [
					...memo,
					[...(memo.length ? memo.reverse()[0] : []), next]
				],
				[]
			)
			.map(fragments => {
				let ruleName = fragments.join(' . '),
					rule = findRuleByDottedName(flatRules, ruleName),
					ruleText = rule.title || capitalise0(rule.name)

				return (
					<li key={fragments.join()}>
						<Link to={'../règle/' + encodeRuleName(ruleName)}>{ruleText}</Link>
						{' › '}
					</li>
				)
			})}
	</ul>
)

export default Namespace
