/* @flow */
import { startCompanyRegistration } from 'Actions/companyStatusActions'
import ScrollToTop from 'Components/utils/ScrollToTop'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as Animate from 'Ui/animate'
import type { Match } from 'react-router'
type Props = {
	startCompanyRegistration: () => void,
	statusChooserCompleted: boolean,
	match: Match
}
const Register = ({
	match,
	startCompanyRegistration,
	statusChooserCompleted
}: Props) => {
	const microenterprise = match.params.status && match.params.status.includes('Microenterprise');
	const SARL = match.params.status && match.params.status.includes('SARL');
	const EURL = match.params.status && match.params.status.includes('EURL');
	
	return(	<Animate.fromBottom>
		<ScrollToTop />
		<h1>Create a {match.params.status} </h1>
		{!statusChooserCompleted && (
			<p>
				<Link to="/register">
					Not sure about this status? Take our guide to help you choose.
				</Link>{' '}
			</p>
		)}
		<p>
			Officially registering online your business is the first thing to do. The
			following data are required:
		</p>
		<ul>
			<li>
				{!microenterprise ?
				<><strong>The corporate name</strong> (raison sociale) is the legal name
				of your company, written on all of your administrative papers. It can be
				different from the trade name (used for commercial purpose).</>
				:<><strong>The corporate name</strong> (raison sociale) is your name and surname the legal name of your company, written on all of your administrative papers.</>
	}
			</li>
			<li>
				<strong>The corporate purpose of the company</strong> (object social) is the main activity run. A secondary activity can be registered
			</li>
			<li>
				<strong>The social security number of the director</strong> is not compulsory to register the business but necessary to get a health insurance
			</li>
			<li>
			{!microenterprise ?
				<><strong>The address</strong> is the physical space where your company
				will be incorporated. In certain places and situations, you can benefit
				from substantial public financing (exemption from charges, taxes, etc.).
				</>: <><strong>The address</strong> is your personal location</>}
			</li>
			{!microenterprise && <li>
				<strong>The company's status</strong>. The official document, written in French, describing the status choice, naming the associate(s) and the capital contributed. It is recommanded to ask the help of a lawyer for the redaction.
				{SARL && <a href="media.apce.com/file/72/3/statuts_sarl_(aout_2014).37032.72723.doc">Example of status for a SARL</a>}
				{EURL && <a href="https://www.afecreation.fr/cid46379/modele-statuts-types-eurl.html">Example of status for an EURL</a>}
			</li>}
		</ul>
		{ !microenterprise && <p>
			If you don't know where your going to open your company, you can discover
			the French territories in our <a>incoporation simulator</a>.
		</p>}
		{/* <p>If the company director is not part of the EU, you'll need a specific visa https://www.economie.gouv.fr/entreprises/etranger-comment-creer-votre-entreprise-france </p> */}
		<p style={{ textAlign: 'right' }}>
			<a
				className="ui__ button"
				href="https://account.guichet-entreprises.fr/user/create"
				{...(!microenterprise ? {rel: "noopener noreferrer",
				onClick: startCompanyRegistration,
				target: "_blank"} : {})}>
				Register my company online
			</a>
			
			<Link to={'/social-security'} className="ui__ skip-button">
				Do it later ›
			</Link>
		</p>
	</Animate.fromBottom>
)}
export default connect(
	state => ({
		statusChooserCompleted:
			Object.keys(state.inFranceApp.companyLegalStatus).length !== 0
	}),
	{ startCompanyRegistration }
)(Register)
