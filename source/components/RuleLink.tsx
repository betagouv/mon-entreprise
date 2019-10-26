import { ThemeColoursContext } from 'Components/utils/withColours'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import { encodeRuleName, nameLeaf } from 'Engine/rules'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Règle } from 'Types/RegleTypes'
import './RuleLink.css'

type RuleLinkProps = Règle & {
	style: React.CSSProperties
	children: React.ReactNode
}

export default function RuleLink({
	dottedName,
	title,
	style,
	children
}: RuleLinkProps) {
	const sitePaths = useContext(SitePathsContext)
	const { colour } = useContext(ThemeColoursContext)
	const newPath =
		sitePaths.documentation.index + '/' + encodeRuleName(dottedName)

	return (
		<Link
			to={newPath}
			className="rule-link"
			title={title}
			style={{ color: colour, ...style }}>
			{children || title || nameLeaf(dottedName)}
		</Link>
	)
}
