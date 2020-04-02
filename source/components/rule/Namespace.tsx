import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import { capitalise0 } from '../../utils'
import './Namespace.css'

export default function Namespace({ dottedName, flatRules, color }) {
	const sitePaths = useContext(SitePathsContext)
	return (
		<ul id="namespace">
			{dottedName
				.split(' . ')
				.slice(0, -1)
				.reduce(
					(memo, next) => [
						...memo,
						[...(memo.length ? memo.reverse()[0] : []), next]
					],
					[]
				)
				.map(fragments => {
					let ruleName = fragments.join(' . '),
						rule = flatRules[ruleName]
					if (!rule) {
						throw new Error(
							`Attention, il se peut que la règle ${ruleName}, ait été définie avec un namespace qui n'existe pas.`
						)
					}
					let ruleText = rule.title || capitalise0(rule.name),
						style = { color }

					return (
						<li style={style} key={fragments.join()}>
							<Link style={style} to={sitePaths.documentation.rule(ruleName)}>
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
