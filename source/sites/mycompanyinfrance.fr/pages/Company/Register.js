/* @flow */
import React from 'react'
import { Link } from 'react-router-dom'
import type { Match, RouterHistory } from 'react-router'
type Props = {
	history: RouterHistory,
	match: Match
}
const Register = ({ match, history }: Props) => (
	<>
		<h1>Create a {match.params.status} </h1>
		<p>
			<Link to="/register">
				Not sure about this status? Take our guide to help you choose.
			</Link>{' '}
		</p>
		<p>
			Register your company to the French administration is the first thing to
			do. It can be done online with the following data :
		</p>
		<ul>
			<li>
				<strong>The corporate name</strong>, also called "raison sociale" in
				french, is the legal name of your company, written on all of your
				administrative papers. It can be different from the trade name (used for
				commercial purpose).
			</li>
			<li>
				<strong>The corporate purpose of the company</strong>, also called
				"object social" is a short phrase describing the activity of your
				company. As it is legally binding it must be composed with care,
				possibly with the help of a lawyer.
			</li>
			<li>
				<strong>The social security number of the director</strong>. In case you
				don't have yet a french social security number...
			</li>
			<li>
				<strong>The address</strong>, the physical space where your company will
				be incorporated. In certain areas, you can benefit from substantial
				government aid (exemption from charges, taxes, etc.).
			</li>
		</ul>
		<p>
			If you don't know where your going to open your company, you can discover
			the French territories in our <a>incoporation simulator</a>.
		</p>
		{/* <p>If the company director is not part of the EU, you'll need a specific visa https://www.economie.gouv.fr/entreprises/etranger-comment-creer-votre-entreprise-france </p> */}
		<p style={{ textAlign: 'right' }}>
			<a
				onClick={() => history.push('/register/registration-pending')}
				className="ui__ button"
				href="https://translate.google.com/translate?depth=1&hl=en&rurl=translate.google.com&sl=fr&sp=nmt4&tl=en&u=https://www.guichet-entreprises.fr/en/how-to-create-your-business/"
				rel="noopener noreferrer"
				target="_blank">
				Register my company online
			</a>
			<Link to={'/social-security'} className="ui__ skip-button">
				Do it later ›
			</Link>
		</p>
	</>
)
export default Register
