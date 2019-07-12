import withSitePaths from 'Components/utils/withSitePaths'
import { encodeRuleName, findRuleByDottedName } from 'Engine/rules'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import { capitalise0 } from '../../utils'
import './Namespace.css'

let Namespace = ({ ns, flatRules, colour, sitePaths }) => {
	return (
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
						rule = findRuleByDottedName(flatRules, ruleName)
					if (!rule) {
						throw new Error(
							`Attention, il se peut que la règle ${ruleName}, ait été définie avec un namespace qui n'existe pas.`
						)
					}
					let ruleText = rule.title || capitalise0(rule.name),
						style = { color: colour }

					return (
						<li style={style} key={fragments.join()}>
							<Link
								style={style}
								to={
									sitePaths.documentation.index + '/' + encodeRuleName(ruleName)
								}>
								{rule.icons && <span>{emoji(rule.icons)} </span>}
								{ruleText}
							</Link>
							{' › '}
						</li>
					)
				})}
		</ul>
	)
}
export default withSitePaths(Namespace)
