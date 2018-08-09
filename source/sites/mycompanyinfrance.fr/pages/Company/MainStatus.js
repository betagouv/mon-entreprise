/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { possibleStatusSelector } from 'Selectors/companyStatusSelectors'
import type { RouterHistory } from 'react-router'
import type { LegalStatus } from 'Selectors/companyStatusSelectors'
const setMainStatus = () => {}

type Props = {
	history: RouterHistory,
	possibleStatus: { [LegalStatus]: boolean },
	setMainStatus: LegalStatus => void
}

const StatusButton = ({ status }: { status: LegalStatus }) => (
	<Link to={`/company/create-${status}`} className="ui__ button">
		Create {status}
	</Link>
)

const SetMainStatus = ({ history, possibleStatus }: Props) => {
	return (
		<>
			<h2>Your legal status</h2>

			<ul>
				{possibleStatus.EI && (
					<li>
						<strong>
							EI - Entreprise individuelle (Individual business):{' '}
						</strong>
						Also called company in own name or company in a personal name. No
						capital contribution is necessary. Private wealth and corporate
						wealth are one.
					</li>
				)}
				{possibleStatus.EIRL && (
					<li>
						<strong>
							EIRL - Entrepreneur individuel à responsabilité limitée
							(Individual entrepreneur with limited liability):{' '}
						</strong>
						Protects your property by assigning to your business a professional
						heritage necessary for the activity.
					</li>
				)}
				{possibleStatus.EURL && (
					<li>
						<strong>
							EURL - Entreprise unipersonnelle à responsabilité limitée (Limited
							personal company):{' '}
						</strong>
						Company with only one partner. Liability is limited to the amount of
						its contribution to the capital.
					</li>
				)}
				{possibleStatus['SARL (minority director)'] && (
					<li>
						<strong>
							SARL - Société à responsabilité limitée (Limited corporation):{' '}
						</strong>
						Composed of at least 2 partners whose financial responsibility is
						limited to the amounts of contributions in the capital. The minimum
						capital is freely fixed in the statutes. The equality or minority
						manager or college has the "salaried" status.
					</li>
				)}
				{possibleStatus['SARL (majority director)'] && (
					<li>
						<strong>
							SARL - Société à responsabilité limitée (Limited corporation):{' '}
						</strong>
						Composed of at least 2 partners whose financial responsibility is
						limited to the amounts of contributions in the capital. The minimum
						capital is freely fixed in the statutes. The majority manager or
						college has the self employed status.
					</li>
				)}
				{possibleStatus.SAS && (
					<li>
						<strong>
							SAS - Société par actions simplifiées (Simplified joint stock
							company):{' '}
						</strong>Composed of at least 2 associates. The financial
						responsibility of the partners is limited to the amounts of
						contributions in the capital. The minimum capital is freely fixed in
						the statutes.
					</li>
				)}
				{possibleStatus.SASU && (
					<li>
						<strong>
							SASU - Société par action simplifiée unipersonnelle (Simplified
							personal joint stock company):{' '}
						</strong>Composed of only one associate. The financial
						responsibility is limited to the amounts of contributions in the
						capital. The minimum capital is freely fixed in the statutes.
					</li>
				)}
				{possibleStatus.SA && (
					<li>
						<strong>SA - Société anonyme (Anonymous company):</strong>Company
						composed of at least 2 shareholders. The only status that allows you
						to be listed on the stock exchange (from 7 shareholders). The
						minimum share capital is €37.000.
					</li>
				)}
				{possibleStatus.SNC && (
					<li>
						<strong>SNC - Société en nom collectif (Partnership):</strong>The
						liability of the partners for the debts of the company is unified
						(one partner only can be sued for the entire debt) and indefinite
						(responsible on the entirety of their personnal wealth).
					</li>
				)}

				{possibleStatus['Microenterprise (option EIRL)'] && (
					<li>
						<strong>Microenterprise (option EIRL):</strong> The micro-enterprise
						is a sole proprietorship company, subject to a flat-rate scheme for
						the calculation of taxes and the payment of social security
						contributions. With the EIRL option, you have limited liability on
						your losses.
					</li>
				)}

				{possibleStatus.Microenterprise && (
					<li>
						<strong>Microenterprise:</strong> The micro-enterprise is a sole
						proprietorship subject to a flat-rate scheme for the calculation of
						taxes and the payment of social security contributions.
					</li>
				)}
			</ul>
			<div className="ui__ answer-group">
				{/* $FlowFixMe */}
				{(Object.entries(possibleStatus): Array<[LegalStatus, boolean]>)
					.filter(([, statusIsVisible]) => statusIsVisible)
					.map(([status]) => (
						<StatusButton key={status} status={status} history={history} />
					))}
				<Link to="/social-security" className="ui__ skip-button">
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
