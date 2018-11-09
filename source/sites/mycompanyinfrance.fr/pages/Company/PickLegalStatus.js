/* @flow */
import { React, T } from 'Components'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { possibleStatusSelector } from 'Selectors/companyStatusSelectors'
import {translate} from 'react-i18next';
import StatusDescription from './StatusDescription'
import type { RouterHistory } from 'react-router'
import {compose} from 'ramda'
import type { LegalStatus } from 'Selectors/companyStatusSelectors'
import withLanguage from 'Components/utils/withLanguage'
import type
{ TFunction } from 'react-i18next'
import sitePaths from '../../sitePaths';

const setMainStatus = () => {}

type Props = {
	history: RouterHistory,
	possibleStatus: { [LegalStatus]: boolean },
	setMainStatus: LegalStatus => void,
	language: string,
	t: TFunction
}

const StatusButton = ({ status }: { status: LegalStatus }) => (
	<Link to={sitePaths().entreprise.créer(status)} className="ui__ button">
		<T>Créer une</T> {status}
	</Link>
)

const SetMainStatus = ({ history, possibleStatus, t, language }: Props) => {
	return (
		<>
			<Helmet>
				<title>{t('listeformejuridique.page.titre', 'Liste des statuts juridiques pour la création de votre entreprise')}</title>
			</Helmet>
			<h2>
				<T>Votre forme juridique</T>
			</h2>

			<ul>
				{possibleStatus.EI && (
					<li>
						<strong>
							EI - Entreprise individuelle {language !== 'fr' && '(Individual business)'}:{' '}
						</strong>
						<StatusDescription status="EI" />
						<br />
						<StatusButton status="EI" history={history} />
					</li>
				)}
				{possibleStatus.EIRL && (
					<li>
						<strong>
							EIRL - Entrepreneur individuel à responsabilité limitée{' '}
							{language !== 'fr' && '(Individual entrepreneur with limited liability)'}:{' '}
						</strong>
						<StatusDescription status="EIRL" />
						<br />
						<StatusButton status="EIRL" history={history} />
					</li>
				)}
				{possibleStatus.EURL && (
					<li>
						<strong>
							EURL - Entreprise unipersonnelle à responsabilité limitée{' '}
							{language !== 'fr' && '(Limited personal company)'}:{' '}
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
							SARL - Société à responsabilité limitée{' '}
							{language !== 'fr' && '(Limited corporation)'}:{' '}
						</strong>
						<StatusDescription status="SARL" />
						<br />
						<StatusButton status="SARL" history={history} />
					</li>
				)}
				{possibleStatus.SAS && (
					<li>
						<strong>
							SAS - Société par actions simplifiées{' '}
							{language !== 'fr' && '(Simplified joint stock company)'}:{' '}
						</strong>
						<StatusDescription status="SAS" />
						<br />
						<StatusButton status="SAS" history={history} />
					</li>
				)}
				{possibleStatus.SASU && (
					<li>
						<strong>
							SASU - Société par action simplifiée unipersonnelle{' '}
							{language !== 'fr' && '(Simplified personal joint stock company)'}:{' '}
						</strong>
						<StatusDescription status="SASU" />
						<br />
						<StatusButton status="SASU" history={history} />
					</li>
				)}
				{possibleStatus.SA && (
					<li>
						<strong>SA - Société anonyme{' '}
						{language !== 'fr' && '(Anonymous company)'}:{' '}</strong>
						<StatusDescription status="SA" />
						<br />
						<StatusButton status="SA" history={history} />
					</li>
				)}
				{possibleStatus.SNC && (
					<li>
						<strong>SNC - Société en nom collectif{' '}
						{language !== 'fr' && '(Partnership)'}:{' '} </strong>
						<StatusDescription status="SNC" />
						<br />
						<StatusButton status="SNC" history={history} />
					</li>
				)}

				{(possibleStatus['Micro-enterprise (option EIRL)'] ||
					possibleStatus['Micro-enterprise']) && (
					<li>
						<strong><T>Micro-enterprise</T>{language === 'fr' && ' '}: </strong>
						<StatusDescription status="micro-enterprise" />
						<br />
						<StatusButton status="micro-enterprise" history={history} />
					</li>
				)}
			</ul>
			<div className="ui__ answer-group">
				<Link to={sitePaths().sécuritéSociale.index} className="ui__ skip-button">
					Choose later ›
				</Link>
			</div>
		</>
	)
}
export default compose(translate(), withLanguage, connect(
	state => ({ possibleStatus: possibleStatusSelector(state) }),
	{ setMainStatus }
))(SetMainStatus)
