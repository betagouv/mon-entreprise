/* @flow */
import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { possibleStatusSelector } from 'Selectors/companyStatusSelectors'
import StatusDescription from './StatusDescription'
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
			<Helmet>
				<title>Legal status list for creating your company in France</title>
			</Helmet>
			<h2>Your legal status</h2>

			<ul>
				{possibleStatus.EI && (
					<li>
						<strong>
							EI - Entreprise individuelle (Individual business):{' '}
						</strong>
						<StatusDescription status="EI" />
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
						<StatusDescription status="EIRL" />
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
						<StatusDescription status="EURL" />
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
						<StatusDescription status="SARL" />
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
						<StatusDescription status="SAS" />
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
						<StatusDescription status="SASU" />
						<br />
						<StatusButton status="SASU" history={history} />
					</li>
				)}
				{possibleStatus.SA && (
					<li>
						<strong>SA - Société anonyme (Anonymous company): </strong>
						<StatusDescription status="SAS" />
						<br />
						<StatusButton status="SA" history={history} />
					</li>
				)}
				{possibleStatus.SNC && (
					<li>
						<strong>SNC - Société en nom collectif (Partnership): </strong>
						<StatusDescription status="SNC" />
						<br />
						<StatusButton status="SNC" history={history} />
					</li>
				)}

				{(possibleStatus['Micro-enterprise (option EIRL)'] ||
					possibleStatus['Micro-enterprise']) && (
					<li>
						<strong>Micro-enterprise: </strong>
						<StatusDescription status="micro-enterprise" />
						<br />
						<StatusButton status="micro-enterprise" history={history} />
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
