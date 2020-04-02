import { ThemeColorsContext } from 'Components/utils/colors'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import { nameLeaf } from 'Engine/ruleUtils'
import { ParsedRule } from 'Engine/types'
import { DottedName } from 'Publicode/rules'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import './RuleLink.css'

type RuleLinkProps = {
	dottedName: DottedName
	title?: ParsedRule['title']
	className?: string
	style?: React.CSSProperties
	children?: React.ReactNode
}

export default function RuleLink({
	dottedName,
	className,
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
			title={title}
			style={{ color, ...style }}
			className={className}
		>
			{children || title || nameLeaf(dottedName)}
		</Link>
	)
}
