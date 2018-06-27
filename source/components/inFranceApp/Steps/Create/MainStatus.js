/* @flow */
import { map, whereEq } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import type { RouterHistory } from 'react-router'
import type { State, CompanyLegalStatus } from '../../types'
const setMainStatus = () => {}
const LEGAL_STATUS_DETAILS: { [status: string]: CompanyLegalStatus } = {
	EI: {
		legalSetup: 'SOLE_PROPRIETORSHIP',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: false
	},
	EURL: {
		legalSetup: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: false
	},
	EIRL: {
		legalSetup: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: false
	},
	SARL: {
		legalSetup: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: true
	},
	SAS: {
		legalSetup: 'LIMITED_LIABILITY',
		directorStatus: 'SALARIED',
		multipleAssociate: true
	},
	SA: {
		legalSetup: 'LIMITED_LIABILITY',
		directorStatus: 'SALARIED',
		multipleAssociate: true
	},
	SNC: {
		legalSetup: 'SOLE_PROPRIETORSHIP',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: true
	},
	SASU: {
		legalSetup: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: false
	}
}

type LegalStatus = $Keys<typeof LEGAL_STATUS_DETAILS>
const possibleStatusSelector = (state: {
	inFranceApp: State
}): { [LegalStatus]: boolean } =>
	// $FlowFixMe
	map(whereEq(state.inFranceApp.companyLegalStatus), LEGAL_STATUS_DETAILS)

type Props = {
	history: RouterHistory,
	possibleStatus: { [LegalStatus]: boolean },
	setMainStatus: LegalStatus => void
}

const StatusButton = ({ status }: { status: LegalStatus }) => (
	<Link to={`/create-my-company/register-${status}`} className="ui__ button">
		Create {status}
	</Link>
)

const SetMainStatus = ({ history, possibleStatus }: Props) => {
	const atLeastOneStatus = Object.values(possibleStatus).some(x => x)
	console.log(atLeastOneStatus, possibleStatus)
	return (
		<>
			<h2>Choosing a legal status</h2>
			{atLeastOneStatus ? (
				<p>
					Based on your previous answers, we narrowed down all the choices to
					the following possibilitie(s):
				</p>
			) : (
				<p>
					{' '}
					We didn&apos;t find any status matching your need. You can go back and
					change your needs, or choose a status manually from the following
					list:
				</p>
			)}
			<ul>
				{(!atLeastOneStatus || possibleStatus.EI) && (
					<li>
						<strong>
							EI - Entreprise individuelle (Individual business):{' '}
						</strong>
						Also called company in own name or company in a personal name. No
						capital contribution is necessary. Private wealth and corporate
						wealth are one.
					</li>
				)}
				{(!atLeastOneStatus || possibleStatus.EIRL) && (
					<li>
						<strong>
							EIRL - Entrepreneur individuel à responsabilité limitée
							(Individual entrepreneur with limited liability):{' '}
						</strong>
						Protects your property by assigning to your business a professional
						heritage necessary for the activity.
					</li>
				)}
				{(!atLeastOneStatus || possibleStatus.EURL) && (
					<li>
						<strong>
							EURL - Entreprise unipersonnelle à responsabilité limitée (Limited
							personal company):{' '}
						</strong>
						Company with only one partner. Liability is limited to the amount of
						its contribution to the capital.
					</li>
				)}
				{(!atLeastOneStatus || possibleStatus.SARL) && (
					<li>
						<strong>
							SARL - Société à responsabilité limitée (Limited corporation):{' '}
						</strong>
						Composed of at least 2 partners whose financial responsibility is
						limited to the amounts of contributions in the capital. The minimum
						capital is freely fixed in the statutes.
					</li>
				)}
				{(!atLeastOneStatus || possibleStatus.SAS) && (
					<li>
						<strong>
							SAS - Société par action simplifiée (Simplified joint stock
							company):{' '}
						</strong>Composed of at least 2 associates. The financial
						responsibility of the partners is limited to the amounts of
						contributions in the capital. The minimum capital is freely fixed in
						the statutes.
					</li>
				)}
				{(!atLeastOneStatus || possibleStatus.SASU) && (
					<li>
						<strong>
							SASU - Société par action simplifiée unitaire (Simplified personal
							joint stock company):{' '}
						</strong>Composed of only one associate. The financial
						responsibility is limited to the amounts of contributions in the
						capital. The minimum capital is freely fixed in the statutes.
					</li>
				)}
				{(!atLeastOneStatus || possibleStatus.SA) && (
					<li>
						<strong>SASU - Société anonyme (Anonymous company):</strong>Company
						composed of at least 2 shareholders if it is not listed.
					</li>
				)}
				{(!atLeastOneStatus || possibleStatus.SNC) && (
					<li>
						<strong>SNC - Société en nom collectif (Partnership):</strong>The
						partners are liable indefinitely and severally for the debts of the
						company.
					</li>
				)}
			</ul>
			<div className="ui__ answer-group">
				{/* $FlowFixMe */}
				{(Object.entries(possibleStatus): Array<[LegalStatus, boolean]>)
					.filter(([, statusIsVisible]) => statusIsVisible || !atLeastOneStatus)
					.map(([status]) => (
						<StatusButton key={status} status={status} history={history} />
					))}
				<Link to="/hiring-and-social-security" className="ui__ skip-button">
					Do it later ›
				</Link>
			</div>
		</>
	)
}
export default connect(
	state => ({ possibleStatus: possibleStatusSelector(state) }),
	{ setMainStatus }
)(SetMainStatus)
