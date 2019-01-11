/* @flow */
import withColours from 'Components/utils/withColours'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import React from 'react'
import { Link } from 'react-router-dom'
import { capitalise0 } from '../utils'
import './RuleLink.css'
import type { Règle } from 'Types/RegleTypes'

type Props = Règle & {
	sitePaths: Object,
	style: CSSStyleDeclaration,
	colours: { colour: string }
}
const RuleLink = ({
	lien,
	nom,
	colours: { colour },
	style,
	sitePaths
}: Props) => {
	const newPath = sitePaths.documentation.index + '/' + lien
	return (
		<Link
			to={newPath}
			className="rule-link"
			style={{ color: colour, ...style }}>
			{capitalise0(nom)}
		</Link>
	)
}

export default compose(
	withSitePaths,
	withColours
)(RuleLink)
