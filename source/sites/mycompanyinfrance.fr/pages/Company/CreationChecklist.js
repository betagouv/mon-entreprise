/* @flow */
import Scroll from 'Components/utils/Scroll'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as Animate from 'Ui/animate'
import { Checklist, CheckItem } from 'Ui/Checklist'
import type { Match } from 'react-router'
import siret from './siret.jpg'


type Props = {
	startCompanyRegistration: () => void,
	statusChooserCompleted: boolean,
	match: Match
}

const Register = ({
	match,
	statusChooserCompleted
}: Props) => {
	const microenterprise =
		match.params.status && match.params.status.includes('Microenterprise')
	const SARL = match.params.status && match.params.status.includes('SARL');
	const EURL = match.params.status && match.params.status.includes('EURL');

	return (
		<Animate.fromBottom>
			<Scroll.toTop />
			<h1>Create a {match.params.status} </h1>
			{!statusChooserCompleted && (
				<p>
					<Link to="/company">
						Not sure about this status? Take our guide to help you choose.
					</Link>{' '}
				</p>
			)}
			<p>
				This checklist will guide you thoughout all the necessary steps to
				register your {match.params.status}.
			</p>
			{!microenterprise && (
				<Checklist>
					<CheckItem 
						name="corporateName" 
						title="Find a corporate name"
						explanations={ <p>
							<strong>The corporate name</strong> (raison sociale) is the legal name
							of your company, written on all of your administrative papers. It can be
							different from the trade name (used for commercial purpose).
							</p>
						}
					/>
					<CheckItem 
						name="corporatePurpose" 
						title="Write the corporate purpose of the company"
						explanations={ <p>
							<strong>The corporate purpose of the company</strong> (object social) 
							is the main activity run. A secondary activity can be registered.
							</p>
						}
					/>
					<CheckItem 
						name="companyAddress"
						title="Find an address to incorporate the company"
						explanations={ <p>
							<strong>The address</strong> is the physical space where your company
							will be incorporated. In certain places and situations, you can benefit
							from substantial public financing (exemption from charges, taxes, etc.).
							</p>
						}
					/>
					<CheckItem 
						name="companyStatus" 
						title="Write the company statuses"
						explanations={ 
							<p><strong>The company's status</strong> is an official document, written 
							in French, describing the status choice, naming the associate(s) and the 
							contributed capital. It is recommanded to ask the help of a lawyer 
							for the redaction.{' '}
							{SARL && <a href="http://media.apce.com/file/72/3/statuts_sarl_(aout_2014).37032.72723.doc">Example of status for a SARL</a>}
							{EURL && <a href="https://www.afecreation.fr/cid46379/modele-statuts-types-eurl.html">Example of status for an EURL</a>}
							</p>
						}
					/>
					<CheckItem name="fundsDeposit" 
						title="Deposit capital funds"
						explanations={ 
							<p>
								The deposit of share capital must be made at the time of the incorporation
								of a company by any person acting on behalf of the company and having 
								received funds from contributions in cash (sum of money) from the creditors
								of the company (shareholder or partner). The deposit consists of a transfer 
								of a sum of money to a blocked account with a bank or the Caisse des dépôts 
								et de consignations or a notary, who must then provide a certificate of 
								deposit of capital.
							</p>
						}
					/>
					<CheckItem 
						name="publishCreationNotice" 
						title="Publish a notice of creation in a newspaper"
						explanations={ <>
							<p>
								A notice of incorporation of the company must be published in a newspaper of legal announcements (JAL), for a cost of publication that depends on the size of the announcement and the rates charged by the JAL.
							</p>
							<p>
								<a href="https://actulegales.fr/journaux-annonces-legales">
									Find a newspaper of legal announcements (JAL)
								</a>
							</p>
							<p>This notice must contain the following information:</p>
							<ul>
								<li>The company name and possibly its acronym</li>
								<li>The legal form</li>
								<li>The amount of the company's capital</li>
								<li>The address of the registered office</li>
								<li>The corporate purpose</li>
								<li>The duration of the company</li>
								<li>The full name and address of the manager and of the persons with general authority to bind the company to third parties, and of the statutory auditors (if appointed)</li>
								<li>The place and number of the RCS with which the company is registered</li>
							</ul>
							</>
						}
					/>
					<CheckItem 
						name="registerCompanyOnline" 
						title="Register your company online" 
						explanations={ <>
							<p>
								To register your company online, you'll need the company name, purpose, address and statuses.
							</p>
							<a
								className="ui__ button"
								href="https://account.guichet-entreprises.fr/user/create"
								target="blank"
							>
								Register my company online
							</a>
							<p>
							<a href="mailto:contact@embauche.beta.gouv.fr">I have trouble to complete the online registration</a>
							</p>
							</>
						}
					/>
				</Checklist>			
			)}
			<h2>Administrative papers</h2>
			<p>Once your business has been officially registered, you will receive:</p>
			<ul>
				<li>
					<strong>Your Siret number</strong>
					, which identifies your company
				</li>
				<li>
					<strong>Your APE code</strong>
					, which defines your business sector
				</li>
				{!microenterprise && <li>
					<strong>Your K-bis extract</strong>
					, which certifies that your company is properly registrated
				</li>}
			</ul>
			<h3>Siren and Siret</h3>
			<p>
				The Siren number identifies your company while the Siret number identifies
				each place of business operated by the same company.
			</p>
			<img src={siret} alt="Siret and siren number" />
			<h3>APE Code</h3>
			<p>
				The APE code for the business sector to which your company belong. The APE
				code is used to classify your company’s main operations in relation to the
				french business nomenclature system (« NAF » code). It also determines the
				applicable collective agreement as well as the industrial accident rate in
				the field to which you or your company belong.
			</p>
			{!microenterprise && 
			<p style={{ textAlign: 'right' }}>
				<Link to={'/social-security'} className="ui__ skip-button">
					Continue to social security ›
				</Link>
			</p>
			}
		</Animate.fromBottom>
	)
}
export default connect(
	state => ({
		statusChooserCompleted:
			Object.keys(state.inFranceApp.companyLegalStatus).length !== 0
	}),
)(Register)
