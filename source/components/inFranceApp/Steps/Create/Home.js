/* @flow */
import React from 'react'
import { Link } from 'react-router-dom'
import * as Animate from '../../animate'
import type { Match } from 'react-router'

type Props = {
	match: Match
}
const CreateMyCompany = ({ match }: Props) => (
	<Animate.fromBottom>
		<h1 className="question__title">Create the company</h1>
		<p>
			First of all, you must register your company with the French
			administration.
		</p>
		{match.isExact && (
			<Link className="ui__ button cta" to={match.path + '/choose-legal-setup'}>
				Choose the legal setup
			</Link>
		)}
		<Link className="ui__ link-button" to="/find-my-company">
			I already have registered my company
		</Link>
	</Animate.fromBottom>
)

export default CreateMyCompany
