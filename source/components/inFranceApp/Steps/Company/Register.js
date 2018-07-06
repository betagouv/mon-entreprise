/* @flow */
import React from 'react'
import { Link } from 'react-router-dom'
import siret from './siret.jpg'
import type { Match } from 'react-router'
import CheckList from 'InFrance/CheckList'

type Props = {
	match: Match
}
export default function RegisterMyCompany({ match }: Props) {
	return (
		<CheckList
			{...{
				name: 'register',
				title: `Checklist to register a ${match.params.status || ''}`,
				subtitle: `
			This checklist will guide you thoughout all the necessary steps to
			register your company with the French administration.
	`,
				items: {
					legalStatus: 'Choose the legal status',
					corporateName: (
						<p>
							Find a corporate name (<em>raison sociale</em>, the legal name of
							your company)
						</p>
					),
					tradeName: 'Find a trade name (for commercial purposes)',
					space: 'Find a space (or work at home)',
					registerCfe: (
						<span>
							Register your company online on{' '}
							<a target="_blank" href="https://www.guichet-entreprises.fr/en/">
								Guichet-entreprises.fr (english)
							</a>
						</span>
					),
					newspaper: `Have the company's creation published in
				a newspaper of legal announcements such as the Bodacc (Bulletin officiel
				des annonces civiles et commerciales)`,
					bankAccount:
						'Open a business bank account and follow the capital deposit procedure if needed',
					insurance: 'Take out professional insurance'
				},

				conclusion: (
					<>
						<p>
							Once your business has been officially registered, you will
							receive :
						</p>
						<ul>
							<li>your Siren number, which identifies your company ;</li>
							<li>
								the Siret number, which identifies each place of business
								operated by the same company.
							</li>
						</ul>
						<img src={siret} alt="Siret and siren number" />
						<p>
							It also assigns the APE code for the business sector to which your
							company or you as a self-employed worker belong. The APE code is
							used to classify your company’s main operations in relation to the
							french business nomenclature system (« NAF » code). It also
							determines the applicable collective agreement as well as the
							industrial accident rate in the field to which you or your company
							belong.
						</p>
						<p>
							Now that you have a properly registered company, the next steps is
							to <strong>hire your first employee</strong>
						</p>
						<div style={{ textAlign: 'center' }}>
							<Link className="ui__ button" to="/social-security">
								Simulate hiring cost in France
							</Link>
						</div>
					</>
				)
			}}
		/>
	)
}
