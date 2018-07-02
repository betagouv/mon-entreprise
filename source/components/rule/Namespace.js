import { encodeRuleName, findRuleByDottedName } from 'Engine/rules'
import React from 'react'
import { Link } from 'react-router-dom'
import { capitalise0 } from '../../utils'
import withColours from '../withColours'
import './Namespace.css'

let Namespace = ({ ns, flatRules, colours }) => (
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
						<Link
							style={{
								color: colours.textColourOnWhite,
								textDecoration: 'underline'
							}}
							replace
							to={'/règle/' + encodeRuleName(ruleName)}>
							{ruleText}
						</Link>
						<i
							style={{ margin: '0 .6em', fontSize: '85%' }}
							className="fa fa-chevron-right namespace__chevron"
							aria-hidden="true"
						/>
					</li>
				)
			})}
	</ul>
)

export default withColours(Namespace)
