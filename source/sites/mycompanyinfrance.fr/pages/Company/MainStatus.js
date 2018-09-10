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
						<br />
						<StatusButton status="EI" history={history} />
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
						<br />
						<StatusButton status="EIRL" history={history} />
					</li>
				)}
				{possibleStatus.EURL && (
					<li>
						<strong>
							EURL - Entreprise unipersonnelle à responsabilité limitée (Limited
							personal company):{' '}
						</strong>
						Company with only one partner. Liability is limited to the amount of
						his contribution to the capital.
						<br />
						<StatusButton status="EURL" history={history} />
					</li>
				)}
				{(possibleStatus['SARL (minority director)'] ||
					possibleStatus['SARL (majority director)']) && (
					<li>
						<strong>
							SARL - Société à responsabilité limitée (Limited corporation):{' '}
						</strong>
						Composed of at least 2 partners whose financial responsibility is
						limited to the amount of their contribution to the company's
						capital. The minimum capital is freely fixed in the articles of
						association.{' '}
						{possibleStatus['SARL (minority director)'] &&
							'The equality or minority manager or college has the "salaried" status.'}
						{possibleStatus['SARL (majority director)'] &&
							'The majority manager or college has the self employed status.'}
						<br />
						<StatusButton status="SARL" history={history} />
					</li>
				)}
				{possibleStatus.SAS && (
					<li>
						<strong>
							SAS - Société par actions simplifiées (Simplified joint stock
							company):{' '}
						</strong>
						Composed of at least 2 associates. The financial responsibility of
						the partners is limited to the amount of their contribution to the
						company's capital. The minimum capital is freely fixed in the
						articles of association.
						<br />
						<StatusButton status="SAS" history={history} />
					</li>
				)}
				{possibleStatus.SASU && (
					<li>
						<strong>
							SASU - Société par action simplifiée unipersonnelle (Simplified
							personal joint stock company):{' '}
						</strong>
						Composed of only one associate. The financial responsibility is
						limited to the amount of his contribution to the company's capital.
						The minimum capital is freely fixed in the statutes.
						<br />
						<StatusButton status="SASU" history={history} />
					</li>
				)}
				{possibleStatus.SA && (
					<li>
						<strong>SA - Société anonyme (Anonymous company): </strong>
						Company composed of at least 2 shareholders. The only status that
						allows you to be listed on the stock exchange (from 7 shareholders).
						The minimum share capital is €37.000.
						<br />
						<StatusButton status="SA" history={history} />
					</li>
				)}
				{possibleStatus.SNC && (
					<li>
						<strong>SNC - Société en nom collectif (Partnership): </strong>
						The liability of the partners for the debts of the company is
						unified (one partner only can be sued for the entire debt) and
						indefinite (responsible on the entirety of their personnal wealth).
						<br />
						<StatusButton status="SNC" history={history} />
					</li>
				)}

				{(possibleStatus['Microenterprise (option EIRL)'] ||
					possibleStatus['Microenterprise']) && (
					<li>
						<strong>Micro-enterprise: </strong>
						The micro-enterprise is a sole proprietorship company, subject to a
						flat-rate scheme for the calculation of taxes and the payment of
						social security contributions.{' '}
						{possibleStatus['Microenterprise (option EIRL)'] &&
							'With the EIRL option, you have limited liability on your losses.'}
						<br />
						<StatusButton status="microenterprise" history={history} />
					</li>
				)}
			</ul>
			<div className="ui__ answer-group">
				<Link to="/social-security" className="ui__ skip-button">
					Choose later ›
				</Link>
			</div>
		</>
	)
}
export default connect(
	state => ({ possibleStatus: possibleStatusSelector(state) }),
	{ setMainStatus }
)(SetMainStatus)
