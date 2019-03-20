import withSitePaths from 'Components/utils/withSitePaths'
import { encodeRuleName, findRuleByDottedName, ruleParents } from 'Engine/rules'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import { capitalise0 } from '../../utils'
import './Namespace.css'

let Namespace = ({ dottedName, flatRules, colour, sitePaths }) => {
	return (
		<ul id="namespace">
			{ruleParents(dottedName)
				.reverse()
				.map(fragments => {
					let ruleName = fragments.join(' . '),
						rule = findRuleByDottedName(flatRules, ruleName)
					if (!rule) {
						throw new Error(
							`Attention, il se peut que la règle ${ruleName}, ait été définie avec un namespace qui n'existe pas.`
						)
					}
					let ruleText = rule.title || capitalise0(rule.name),
						style = {
							color: colour,
							background: `rgba(255, 255, 255, ${0.1 +
								(ruleParents(dottedName).length - fragments.length) / 10})`,
							borderRadius: '.2em',
							borderTopRightRadius: '1em',
							borderBottomRightRadius: '1em',

							padding: '0.3em 0.4em .1em'
						}

					return (
						<li style={style} key={fragments.join()}>
							<Link
								to={
									sitePaths.documentation.index + '/' + encodeRuleName(ruleName)
								}>
								{rule.icon && <span>{emoji(rule.icon)} </span>}
								{ruleText}
							</Link>
						</li>
					)
				})}
		</ul>
	)
}
export default withSitePaths(Namespace)
