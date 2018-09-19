/* @flow */
import {
	checkCompanyCreationItem,
	initializeCompanyCreationChecklist
} from 'Actions/companyCreationChecklistActions'
import { goToCompanyStatusChoice } from 'Actions/companyStatusActions'
import Scroll from 'Components/utils/Scroll'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as Animate from 'Ui/animate'
import { CheckItem, Checklist } from 'Ui/Checklist'
import type { Match } from 'react-router'

type Props = {
	statusChooserCompleted: boolean,
	match: Match,
	onChecklistInitialization: (string, Array<string>) => void,
	onStatusChange: () => void,
	onItemCheck: (name: string, checked: boolean) => void,
	companyCreationChecklist: { [string]: boolean }
}

const CreateCompany = ({
	match,
	statusChooserCompleted,
	onChecklistInitialization,
	onItemCheck,
	companyCreationChecklist,
	onStatusChange
}: Props) => {
	const status = match.params.status
	return (
		<Animate.fromBottom>
			<Scroll.toTop />
			<h1>Create a {match.params.status} </h1>
			{!statusChooserCompleted && (
				<p>
					<button className="ui__ link-button" onClick={onStatusChange}>
						Not sure about this status? Take our guide to help you choose
					</button>
				</p>
			)}
			<p>
				This checklist will guide you throughout all the necessary steps to
				register your {match.params.status}.
			</p>
			<h2 style={{ fontSize: '1.5rem' }}>Needed for registration</h2>
			<Checklist
				key={match.params.status}
				onInitialization={items =>
					onChecklistInitialization(match.params.status || '', items)
				}
				onItemCheck={onItemCheck}
				defaultChecked={companyCreationChecklist}>
				{!['EI', 'EIRL', 'micro-enterprise'].includes(status) && (
					<CheckItem
						name="corporateName"
						title="Find a corporate name"
						explanations={
							<>
								<p>
									<strong>The corporate name</strong> ("dénomination sociale")
									is the legal name of your company, written on all of your
									administrative papers. It can be different from the trade name
									(used for commercial purpose).
								</p>
								<p>
									It is advisable to check that the name is available, i.e. that
									it does not infringe a name already protected by a trademark,
									a company name, a trade name, an Internet domain name, etc.
									You can check on the{' '}
									<a href="http://bases-marques.inpi.fr/">INPI database</a>.
								</p>
							</>
						}
					/>
				)}
				<CheckItem
					name="corporatePurpose"
					title="Write the corporate purpose of the company"
					explanations={
						<p>
							<strong>The corporate purpose of the company</strong> ("objet
							social") is the main activity run. A secondary activity can be
							registered.
						</p>
					}
				/>
				{status !== 'micro-enterprise' && (
					<CheckItem
						name="companyAddress"
						title="Find an address to incorporate the company"
						explanations={
							<>
								<p>
									<strong>The address</strong> is the physical space where your
									company will be incorporated. In certain places and
									situations, you can benefit from substantial public financing
									(exemption from charges, taxes, etc.).{' '}
									<a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F2160">
										More information (Fr)
									</a>
								</p>
							</>
						}
					/>
				)}
				{!['EI', 'EIRL', 'micro-enterprise'].includes(status) && (
					<CheckItem
						name="companyStatus"
						title="Write the company's articles"
						explanations={
							<p>
								<strong>The company's articles of association</strong> ( "les
								statuts"), is an official document written in French, describing
								the status choice, naming the associate(s) and the contributed
								capital. For more than one associate, it is recommended to ask
								for the help of a lawyer to write them.{' '}
								{status === 'SARL' && (
									<a href="http://media.apce.com/file/72/3/statuts_sarl_(aout_2014).37032.72723.doc">
										Example of articles for a SARL
									</a>
								)}
								{status === 'EURL' && (
									<a href="https://www.afecreation.fr/cid46379/modele-statuts-types-eurl.html">
										Example of articles for an EURL
									</a>
								)}
							</p>
						}
					/>
				)}
				<CheckItem
					name="openBankAccount"
					title="Open a business bank account"
					explanations={
						<>
							<p>
								The purpose of a <strong>professional bank account</strong> is
								to separate your company's assets from your personal assets.{' '}
								{status === 'EI' &&
									'If its opening is not obligatory for an EI, it is strongly recommended. '}
								The professional bank account allows you to:
							</p>
							<ul>
								<li>
									Differentiate your private and professional operations and
									simplify your cash management
								</li>
								<li>Facilitate any tax audit operations.</li>
							</ul>
						</>
					}
				/>
				{!['EI', 'EIRL', 'micro-enterprise'].includes(status) && (
					<CheckItem
						name="fundsDeposit"
						title="Deposit capital funds"
						explanations={
							<>
								<p>
									The <strong>deposit of share capital</strong> must be made at
									the time of the incorporation of a company by any person
									acting on behalf of the company and having received funds from
									contributions in cash (sum of money) from the creditors of the
									company (shareholder or partner).{' '}
								</p>
								<p>
									The deposit consists of a transfer of a sum of money to a
									blocked account with a bank or the public{' '}
									<a href="https://consignations.caissedesdepots.fr/enterprise/creer-votre-enterprise/creation-dentreprise-deposez-votre-capital-social">
										Caisse des dépôts et consignations
									</a>{' '}
									or a notary, who must then provide a certificate of deposit of
									capital.
								</p>
							</>
						}
					/>
				)}
				{!['EI', 'EIRL', 'micro-enterprise'].includes(status) && (
					<CheckItem
						name="publishCreationNotice"
						title="Publish a notice of creation in a newspaper"
						explanations={
							<>
								<p>
									A <strong>notice of incorporation of the company</strong> must
									be published in a newspaper of legal announcements ("JAL"),
									for a cost of publication that depends on the size of the
									announcement and the rates charged by the chosen newspaper.
								</p>
								<p>
									<a href="https://actulegales.fr/journaux-annonces-legales">
										Find a newspaper of legal announcements ("JAL")
									</a>
								</p>
								<p>This notice must contain the following information:</p>
								<ul>
									<li>The company's name and possibly its acronym</li>
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
					title="Register your company online"
					explanations={
						<>
							<p>
								You can start your online registration process anytime, save it
								and come back to it as you wish.
							</p>
							<div style={{ textAlign: 'center' }}>
								<a
									className="ui__ button"
									href="https://account.guichet-entreprises.fr/user/create"
									target="blank">
									Start registration process
								</a>
							</div>
						</>
					}
				/>
			</Checklist>
			<h2 style={{ fontSize: '1.5rem' }}>
				Recommended before starting your activity
			</h2>

			<Checklist>
				{status !== 'micro-enterprise' && (
					<CheckItem
						name="chooseCertifiedAccountant"
						title="Choose a certified accountant"
						explanations={
							<p>
								Managing a company brings a number of{' '}
								<a href="https://www.economie.gouv.fr/entreprises/obligations-comptables">
									accounting obligations
								</a>
								. It is advisable to call in a competent person that can handle
								accounting for you.
							</p>
						}
					/>
				)}
				<CheckItem
					name="checkoutProfessionalAssuranceNeeds"
					title="Check out the need for professional insurance"
					explanations={
						<>
							<p>
								An SME or self-employed person must protect themselves against
								the main risks to which they are exposed and take out guarantee
								contracts. Whether it is a tenant or owner of its walls, the
								company must insure its buildings, its professional equipment,
								its goods, its raw materials, its vehicles, as well as in terms
								of civil liability of the company and its managers or in terms
								of operating loss.
							</p>
							<a href="https://www.economie.gouv.fr/entreprises/assurances-obligatoires">
								More information (Fr)
							</a>
						</>
					}
				/>
			</Checklist>
			<p className="ui__ notice">
				You can use these lists to track down your advancement in the business
				creation process. This page automatically saves your progress.
			</p>
			<p style={{ display: 'flex', justifyContent: 'space-between' }}>
				<button onClick={onStatusChange} className="ui__ skip-button left">
					‹ Choose another status
				</button>
				<Link to={'/company/after-registration'} className="ui__ skip-button">
					After registration ›
				</Link>
			</p>
		</Animate.fromBottom>
	)
}
export default connect(
	state => ({
		companyCreationChecklist: state.inFranceApp.companyCreationChecklist,
		statusChooserCompleted:
			Object.keys(state.inFranceApp.companyLegalStatus).length !== 0
	}),
	{
		onChecklistInitialization: initializeCompanyCreationChecklist,
		onItemCheck: checkCompanyCreationItem,
		onStatusChange: goToCompanyStatusChoice
	}
)(CreateCompany)
