import { ThemeColorsContext } from 'Components/utils/colors'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import { nameLeaf } from 'Engine/ruleUtils'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Rule } from 'Types/rule'
import './RuleLink.css'

type RuleLinkProps = {
	dottedName: Rule['dottedName']
	title?: Rule['title']
	style?: React.CSSProperties
	children?: React.ReactNode
}

export default function RuleLink({
	dottedName,
	title,
	style,
	children
}: RuleLinkProps) {
	const sitePaths = useContext(SitePathsContext)
	const { color } = useContext(ThemeColorsContext)
	const newPath = sitePaths.documentation.rule(dottedName)

	return (
		<Link
			to={newPath}
			className="rule-link"
			title={title}
			style={{ color, ...style }}
		>
			{children || title || nameLeaf(dottedName)}
		</Link>
	)
}
