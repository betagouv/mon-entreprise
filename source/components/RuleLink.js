/* @flow */
import withColours from 'Components/utils/withColours'
import withSitePaths from 'Components/utils/withSitePaths'
import { encodeRuleName, findRuleByDottedName, nameLeaf } from 'Engine/rules'
import { compose } from 'ramda'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
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
	sitePaths,
	children
}: Props) => {
	const flatRules = useSelector(flatRulesSelector)
	const flatRule = findRuleByDottedName(flatRules, dottedName)
	const newPath =
		sitePaths.documentation.index + '/' + encodeRuleName(dottedName)

	return (
		<Link
			to={newPath}
			className="rule-link"
			title={title}
			style={{ color: colour, ...style }}>
			{children || title || flatRule.titre || nameLeaf(dottedName)}
		</Link>
	)
}

export default compose(
	withSitePaths,
	withColours
)(RuleLink)
