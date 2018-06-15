/* @flow */
import React from 'react'
import { Link } from 'react-router-dom'
import withColours from '../withColours'
import './RuleLink.css'
import type { Règle } from './types'
type Props = Règle
const RuleLink = ({
	lien,
	nom,
	colours: { colour },
	style
}: Props & { colours: { colour: string }, style: any }) => (
	<Link to={lien} className="rule-link" style={{ color: colour, ...style }}>
		{nom}
	</Link>
)

export default withColours(RuleLink)
