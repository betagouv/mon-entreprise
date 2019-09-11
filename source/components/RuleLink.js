/* @flow */
import withColours from 'Components/utils/withColours'
import withSitePaths from 'Components/utils/withSitePaths'
import { encodeRuleName, nameLeaf } from 'Engine/rules'
import { compose } from 'ramda'
import React from 'react'
import { Link } from 'react-router-dom'
import './RuleLink.css'
import type { Règle } from 'Types/RegleTypes'
import type { ThemeColours } from 'Components/utils/withColours'

type Props = Règle & {
	sitePaths: Object,
	style: CSSStyleDeclaration,
	colours: ThemeColours
}
const RuleLink = ({
	dottedName,
	title,
	colours: { colour },
	style,
	skipTrivialRule = true,
	sitePaths,
	children
}: Props) => {
	const newPath =
		sitePaths.documentation.index + '/' + encodeRuleName(dottedName)

	return (
		<Link
			to={{ pathname: newPath, state: { skipTrivialRule } }}
			className="rule-link"
			style={{ color: colour, ...style }}>
			{children || title || nameLeaf(dottedName)}
		</Link>
	)
}

export default compose(
	withSitePaths,
	withColours
)(RuleLink)
