import { ThemeColorsContext } from 'Components/utils/colors'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DottedName } from 'Rules'
import { parsedRulesSelector } from 'Selectors/analyseSelectors'
import { capitalise0 } from '../../utils'
import './Namespace.css'

export default function Namespace({ dottedName }: { dottedName: DottedName }) {
	const sitePaths = useContext(SitePathsContext)
	const colors = useContext(ThemeColorsContext)
	const flatRules = useSelector(parsedRulesSelector)
	return (
		<ul id="namespace">
			{dottedName
				.split(' . ')
				.slice(0, -1)
				.reduce(
					(memo: string[][], next: string) => [
						...memo,
						[...(memo.length ? memo.reverse()[0] : []), next]
					],
					[]
				)
				.map((fragments: string[]) => {
					let ruleName = fragments.join(' . ') as DottedName,
						rule = flatRules[ruleName]
					if (!rule) {
						throw new Error(
							`Attention, il se peut que la règle ${ruleName}, ait été définie avec un namespace qui n'existe pas.`
						)
					}
					let ruleText = rule.title || capitalise0(rule.name),
						style = { color: colors.textColor }

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
