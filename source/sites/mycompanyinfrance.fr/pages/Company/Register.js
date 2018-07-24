/* @flow */
import React from 'react'
import { Link } from 'react-router-dom'
import type { Match } from 'react-router'
import { startCompanyRegistration } from "Actions/companyStatusActions";
import { connect } from "react-redux";
type Props = {
	startCompanyRegistration: () => void,
	match: Match
}
const Register = ({ match, startCompanyRegistration }: Props) => (
	<>
		<h1>Create a {match.params.status} </h1>
		<p>
			<Link to="/register">
				Not sure about this status? Take our guide to help you choose.
			</Link>{' '}
		</p>
		<p>
			Officially registering online your business is the first thing to do. The following data are required: 
		</p>
		<ul>
			<li>
				<strong>The corporate name</strong> (raison sociale) is the legal name of your company, written on all of your
				administrative papers. It can be different from the trade name (used for
				commercial purpose).
			</li>
			<li>
				<strong>The corporate purpose of the company</strong> (object social) is a short phrase describing the activity of your
				company. As it is legally binding it must be composed with care,
				possibly with the help of a lawyer.
			</li>
			<li>
				<strong>The social security number of the director</strong>. In case you
				don't have yet a french social security number...
			</li>
			<li>
				<strong>The address</strong> is the physical space where your company will
				be incorporated. In certain places and situations, you can benefit from substantial
				public financing (exemption from charges, taxes, etc.).
			</li>
		</ul>
		<p>
			If you don't know where your going to open your company, you can discover
			the French territories in our <a>incoporation simulator</a>.
		</p>
		{/* <p>If the company director is not part of the EU, you'll need a specific visa https://www.economie.gouv.fr/entreprises/etranger-comment-creer-votre-entreprise-france </p> */}
		<p style={{ textAlign: 'right' }}>
			<a
				onClick={startCompanyRegistration}
				className="ui__ button"
				href="https://translate.google.fr/translate?sl=fr&tl=en&js=y&prev=_t&hl=fr&ie=UTF-8&u=www.guichet-entreprises.fr&edit-text=&act=url"
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
export default connect(null, { startCompanyRegistration })
	(Register)
