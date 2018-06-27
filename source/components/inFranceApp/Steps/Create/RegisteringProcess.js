/* @flow */
import React from 'react'
import { Link } from 'react-router-dom'
import * as Animate from '../../animate'
import type { Match } from 'react-router'

type Props = {
	match: Match
}
const RegisterMyCompany = ({ match }: Props) => (
	<Animate.fromBottom>
		<h1 className="question__title">
			Checklist to register a {match.params.status}
		</h1>
		<p>
			This checklist will guide you thoughout all the necessary steps to
			register your company with the French administration.
		</p>
		<ul className="ui__ no-bullet">
			<li>
				<input type="checkbox" /> Finding a corporate name and a trade name
			</li>
			<li>
				<input type="checkbox" /> Find a space (or work at home)
			</li>
			<li>
				<input type="checkbox" checked /> Choose the legal status
			</li>
			<li>
				<input type="checkbox" /> Register your company online on{' '}
				<a href="https://www.guichet-entreprises.fr/en/">
					Guichet-entreprises.fr (english)
				</a>
			</li>
			<li>
				<input type="checkbox" /> Have the company&apos;s creation published in
				a newspaper of legal announcements such as the Bodacc (Bulletin officiel
				des annonces civiles et commerciales);
			</li>

			<li>
				<input type="checkbox" /> Make your company known to the Post Office
			</li>

			<li>
				<input type="checkbox" /> Open a business bank account
			</li>

			<li>
				<input type="checkbox" /> Take out professional insurance;{' '}
			</li>
		</ul>
		<p>
			You can add this page to your favorite and keep track of your progress in
			the different administrative tasks. Now that you have a properly
			registered company, the next steps is to{' '}
			<strong>hire your first employee</strong>
		</p>
		<Link className="ui__ button cta" to="/simulate-my-costs">
			Simulate hiring cost in France
		</Link>
	</Animate.fromBottom>
)

export default RegisterMyCompany
