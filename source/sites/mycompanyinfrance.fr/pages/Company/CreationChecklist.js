/* @flow */
import Scroll from 'Components/utils/Scroll'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as Animate from 'Ui/animate'
import { Checklist, CheckItem } from 'Ui/Checklist'
import type { Match } from 'react-router'
import { checkCompanyCreationItem, initializeCompanyCreationChecklist } from 'Actions/companyCreationChecklistActions'
import { goToCompanyStatusChoice } from 'Actions/companyStatusActions'
import siret from './siret.jpg'

type Props = {
	statusChooserCompleted: boolean,
	match: Match,
	onChecklistInitialization: (string, Array<string>) => void,
	onStatusChange: () => void,
	onItemCheck: (name: string, checked: boolean) => void,
	companyCreationChecklist: {[string]: boolean}
}

const CreateCompany = ({ match, statusChooserCompleted, onChecklistInitialization, onItemCheck, companyCreationChecklist, onStatusChange}: Props) => {
	const microenterprise =
		match.params.status && match.params.status.includes('microenterprise')
	const SARL = match.params.status && match.params.status.includes('SARL')
	const EURL = match.params.status && match.params.status.includes('EURL')

	return (
		<Animate.fromBottom>
			<Scroll.toTop />
			<h1>Create a {match.params.status} </h1>
					{!statusChooserCompleted &&	
				<p>
					<button className="ui__ link-button" onClick={onStatusChange}>
						Not sure about this status? Take our guide to help you choose
					</button>
				</p>}
			<p>
				This checklist will guide you thoughout all the necessary steps to
				register your {match.params.status}.
			</p>

			<Checklist 
				onInitialization={(items) => onChecklistInitialization(match.params.status || '', items)}
				onItemCheck={onItemCheck}
				defaultChecked={companyCreationChecklist}
			>
				{!microenterprise && (
					<CheckItem
						name="corporateName"
						title="Find a corporate name"
						explanations={
							<p>
								<strong>The corporate name</strong> (raison sociale) is the
								legal name of your company, written on all of your
								administrative papers. It can be different from the trade name
								(used for commercial purpose).
							</p>
						}
					/>
				)}
				<CheckItem
					name="corporatePurpose"
					title="Write the corporate purpose of the company"
					explanations={
						<p>
							<strong>The corporate purpose of the company</strong> (object
							social) is the main activity run. A secondary activity can be
							registered.
						</p>
					}
				/>
				{!microenterprise && (
					<CheckItem
						name="companyAddress"
						title="Find an address to incorporate the company"
						explanations={
							<p>
								<strong>The address</strong> is the physical space where your
								company will be incorporated. In certain places and situations,
								you can benefit from substantial public financing (exemption
								from charges, taxes, etc.).
							</p>
						}
					/>
				)}
				{!microenterprise && (
					<CheckItem
						name="companyStatus"
						title="Write the company statuses"
						explanations={
							<p>
								<strong>The company's status</strong> is an official document,
								written in French, describing the status choice, naming the
								associate(s) and the contributed capital. It is recommanded to
								ask the help of a lawyer for the redaction.{' '}
								{SARL && (
									<a href="http://media.apce.com/file/72/3/statuts_sarl_(aout_2014).37032.72723.doc">
										Example of status for a SARL
									</a>
								)}
								{EURL && (
									<a href="https://www.afecreation.fr/cid46379/modele-statuts-types-eurl.html">
										Example of status for an EURL
									</a>
								)}
							</p>
						}
					/>
				)}
				{!microenterprise && (
					<CheckItem
						name="fundsDeposit"
						title="Deposit capital funds"
						explanations={
							<>
								<p>
									The deposit of share capital must be made at the time of the
									incorporation of a company by any person acting on behalf of
									the company and having received funds from contributions in
									cash (sum of money) from the creditors of the company
									(shareholder or partner).{' '}
								</p>
								<p>
									The deposit consists of a transfer of a sum of money to a
									blocked account with a bank or the Caisse des dépôts et de
									consignations or a notary, who must then provide a certificate
									of deposit of capital.
								</p>
							</>
						}
					/>
				)}
				{!microenterprise && (
					<CheckItem
						name="publishCreationNotice"
						title="Publish a notice of creation in a newspaper"
						explanations={
							<>
								<p>
									A notice of incorporation of the company must be published in
									a newspaper of legal announcements (JAL), for a cost of
									publication that depends on the size of the announcement and
									the rates charged by the JAL.
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
									<li>
										The full name and address of the manager and of the persons
										with general authority to bind the company to third parties,
										and of the statutory auditors (if appointed)
									</li>
									<li>
										The place and number of the RCS with which the company is
										registered
									</li>
								</ul>
							</>
						}
					/>
				)}
				<CheckItem
					name="registerCompanyOnline"
					title="Create your company online"
					explanations={
						<>
							<p>
								You can start your online registration process anytime, save it
								and come back to it as you wish.
							</p>
							<p>
								<a
									className="ui__ button"
									href="https://account.guichet-entreprises.fr/user/create"
									target="blank">
									Create my company online
								</a>
							</p>
							<p>
								<a href="mailto:contact@embauche.beta.gouv.fr">
									I have trouble to complete the online registration
								</a>
							</p>
						</>
					}
				/>
			</Checklist>
			<h2>After registration</h2>
			<p>
				{' '}
				Once your business has been officially registered, you will receive:
			</p>
			<Checklist>
				<CheckItem
					name="siretNumber"
					title={
						<>
							<strong>Your Siret number</strong>, which identifies your company
						</>
					}
					explanations={
						<>
							<p>
								The Siren number identifies your company while the Siret number
								identifies each place of business operated by the same company.
								<img src={siret} alt="Siret and siren number" />
							</p>
						</>
					}
				/>
				<CheckItem
					name="APECode"
					title={
						<>
							<strong>Your APE code</strong>, which defines your business sector
						</>
					}
					explanations={
						<>
							<p>
								<strong>The APE</strong> code for the business sector to which
								your company belong. The APE is used to classify your company’s
								main operations in relation to the French business nomenclature
								system (« NAF » code). It also determines the applicable
								collective agreement as well as the industrial accident rate in
								the field to which you or your company belong.
							</p>
						</>
					}
				/>
				{!microenterprise && (
					<CheckItem
						name="Kbis"
						title={
							<>
								<strong>Your Kbis</strong>, which certifies that your company is
								properly registrated
							</>
						}
						explanations={
							<>
								<p>
									When creating a business or declaring an activity, the
									entrepreneur whose professional activity consists of
									commercial acts must register with the RCS.
								</p>
								<p>
									The proof of registration in the RCS is made by the
									presentation of a document delivered by the clerk's office of
									the court of commerce: the Kbis.
								</p>
								<p>
									It is the only official document attesting to the legal
									existence of a commercial enterprise.
								</p>
								<p>
									In most cases, to be opposable and authentic for
									administrative procedures, the extract must be less than 3
									months old.
								</p>
								<p>
									This document is generally requested when applying for a
									public tender, opening a professional bank account, purchasing
									professional equipment from distributors, etc.
								</p>
							</>
						}
					/>
				)}
			</Checklist>
			<p style={{ display: 'flex', justifyContent: 'space-between' }}>
				<button onClick={onStatusChange} className="ui__ skip-button left">
					‹ Choose another status
				</button>
				<Link to={'/social-security'} className="ui__ skip-button">
					Continue to social security ›
				</Link>
			</p>
		</Animate.fromBottom>
	)
}
export default connect(state => ({
	companyCreationChecklist: state.inFranceApp.companyCreationChecklist,
	statusChooserCompleted:
		Object.keys(state.inFranceApp.companyLegalStatus).length !== 0
}), {
	onChecklistInitialization:  initializeCompanyCreationChecklist,
	onItemCheck: checkCompanyCreationItem,
	onStatusChange: goToCompanyStatusChoice,
})(CreateCompany)
