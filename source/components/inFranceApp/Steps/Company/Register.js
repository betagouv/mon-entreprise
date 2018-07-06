/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { config } from 'react-spring'
import * as Animate from '../../animate'
import siret from './siret.jpg'
import type { Match } from 'react-router'

type Props = {
	match: Match,
	checklist: { [string]: boolean },
	onChecklistItemChange: (string, boolean) => void
}
const RegisterMyCompany = ({
	match,
	onChecklistItemChange,
	checklist
}: Props) => (
	<Animate.fromBottom config={config.stiff}>
		<h1 className="question__title">
			Checklist to register a {match.params.status}
		</h1>
		<p>
			This checklist will guide you thoughout all the necessary steps to
			register your company with the French administration.
		</p>
		<ul className="ui__ no-bullet">
			<li>
				<label>
					<input type="checkbox" checked name="legalStatus" readOnly /> Choose
					the legal status
				</label>
			</li>
			<li>
				<label>
					<input
						type="checkbox"
						name="corporateName"
						defaultChecked={checklist.corporateName}
						onChange={({ target }) =>
							onChecklistItemChange(target.name, target.checked)
						}
					/>{' '}
					Find a corporate name
				</label>
			</li>
			<li>
				<label>
					<input
						type="checkbox"
						name="tradeName"
						defaultChecked={checklist.tradeName}
						onChange={({ target }) =>
							onChecklistItemChange(target.name, target.checked)
						}
					/>{' '}
					Find a trade name
				</label>
			</li>
			<li>
				<label>
					<input
						type="checkbox"
						name="space"
						defaultChecked={checklist.space}
						onChange={({ target }) =>
							onChecklistItemChange(target.name, target.checked)
						}
					/>{' '}
					Find a space (or work at home)
				</label>
			</li>
			<li>
				<label>
					<input
						type="checkbox"
						name="registerCfe"
						defaultChecked={checklist.registerCfe}
						onChange={({ target }) =>
							onChecklistItemChange(target.name, target.checked)
						}
					/>{' '}
					Register your company online on{' '}
					<a href="https://www.guichet-entreprises.fr/en/">
						Guichet-entreprises.fr (english)
					</a>
				</label>
			</li>
			<li>
				<label>
					<input
						type="checkbox"
						name="announceCreation"
						defaultChecked={checklist.announceCreation}
						onChange={({ target }) =>
							onChecklistItemChange(target.name, target.checked)
						}
					/>{' '}
					Have the company&apos;s creation published in a newspaper of legal
					announcements such as the Bodacc (Bulletin officiel des annonces
					civiles et commerciales);
				</label>
			</li>
			<li>
				<label>
					<input
						type="checkbox"
						name="bankAccount"
						defaultChecked={checklist.bankAccount}
						onChange={({ target }) =>
							onChecklistItemChange(target.name, target.checked)
						}
					/>{' '}
					Open a business bank account
				</label>
			</li>

			<li>
				<label>
					<input
						type="checkbox"
						name="professionalInsurance"
						defaultChecked={checklist.professionalInsurance}
						onChange={({ target }) =>
							onChecklistItemChange(target.name, target.checked)
						}
					/>{' '}
					Take out professional insurance;{' '}
				</label>
			</li>
		</ul>
		<p>
			You can add this page to your favorite and keep track of your progress in
			the different administrative tasks.
		</p>
		<p>Once your business has been officially registered, you will receive :</p>
		<ul>
			<li>your Siren number, which identifies your company ;</li>
			<li>
				the Siret number, which identifies each place of business operated by
				the same company.
			</li>
		</ul>
		<img src={siret} alt="Siret and siren number" />
		<p>
			It also assigns the APE code for the business sector to which your company
			or you as a self-employed worker belong. The APE code is used to classify
			your company’s main operations in relation to the french business
			nomenclature system (« NAF » code). It also determines the applicable
			collective agreement as well as the industrial accident rate in the field
			to which you or your company belong.
		</p>
		<p>
			Now that you have a properly registered company, the next steps is to{' '}
			<strong>hire your first employee</strong>
		</p>
		<div style={{ textAlign: 'center' }}>
			<Link className="ui__ button" to="/social-security">
				Simulate hiring cost in France
			</Link>
		</div>
	</Animate.fromBottom>
)

export default connect(
	state => ({
		checklist: state.inFranceApp.companyCreationChecklist
	}),
	{
		onChecklistItemChange: (name, value) => ({
			type: 'CHANGE_COMPANY_CREATION_CHECKLIST_ITEM',
			name,
			value
		})
	}
)(RegisterMyCompany)
