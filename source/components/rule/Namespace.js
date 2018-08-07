import { encodeRuleName, findRuleByDottedName } from 'Engine/rules'
import React from 'react'
import { Link } from 'react-router-dom'
import { capitalise0 } from '../../utils'
import './Namespace.css'

let Namespace = ({ ns, flatRules, colour }) => (
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
					ruleText = rule.title || capitalise0(rule.name),
					style = { color: colour }

				return (
					<li style={style} key={fragments.join()}>
						<Link style={style} to={'../règle/' + encodeRuleName(ruleName)}>
							{ruleText}
						</Link>
						{' › '}
					</li>
				)
			})}
	</ul>
)

export default Namespace
