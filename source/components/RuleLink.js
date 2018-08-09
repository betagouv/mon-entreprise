/* @flow */
import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import React from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { capitalise0 } from '../utils'
import './RuleLink.css'
import type { Règle } from 'Types/RegleTypes'
import type { Match } from 'react-router'
type Props = Règle & {
	match: Match,
	style: CSSStyleDeclaration,
	colours: { colour: string }
}
const RuleLink = ({ lien, nom, colours: { colour }, match, style }: Props) => (
	<Link
		to={match.path + (match.path.endsWith('/') ? '' : '/') + lien}
		className="rule-link"
		style={{ color: colour, ...style }}>
		{capitalise0(nom)}
	</Link>
)

export default compose(
	withRouter,
	withColours
)(RuleLink)
