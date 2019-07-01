/* @flow */
import withColours from 'Components/utils/withColours'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import React from 'react'
import { Link } from 'react-router-dom'
import './RuleLink.css'
import type { Règle } from 'Types/RegleTypes'
import type { ThemeColours } from 'Components/utils/withColours'
import { encodeRuleName } from 'Engine/rules'

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
	sitePaths
}: Props) => {
	const newPath =
		sitePaths.documentation.index + '/' + encodeRuleName(dottedName)

	return (
		<Link
			to={newPath}
			className="rule-link"
			style={{ color: colour, ...style }}>
			{title}
		</Link>
	)
}

export default compose(
	withSitePaths,
	withColours
)(RuleLink)
