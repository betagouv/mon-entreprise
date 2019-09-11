/* @flow */
import { goBackToPreviousQuestion } from 'Actions/companyStatusActions'
import { React, T } from 'Components'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose, filter } from 'ramda'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { possibleStatusSelector } from 'Selectors/companyStatusSelectors'
import StatusDescription from './StatusDescription'
import type { RouterHistory } from 'react-router'
import type { LegalStatus } from 'Selectors/companyStatusSelectors'
import type { TFunction } from 'react-i18next'

type Props = {
	history: RouterHistory,
	possibleStatus: { [LegalStatus]: boolean },
	goBackToPreviousQuestion: () => void,
	sitePaths: Object,
	setMainStatus: LegalStatus => void,
	language: string
}

const StatusButton = withSitePaths(
	({ status, sitePaths }: { status: LegalStatus, sitePaths: Object }) => {
		const { t } = useTranslation()
		return (
			<div className="ui__ answer-group">
				<Link to={sitePaths.entreprise.créer(status)} className="ui__ button">
					{status.includes('auto-entrepreneur') ? (
						<T>Devenir</T>
					) : (
						<T>Créer une</T>
					)}{' '}
					{t(status)}
				</Link>
			</div>
		)
	}
)
const StatusTitle = ({ status, language }) =>
	status === 'EI' ? (
		<>
			Entreprise individuelle {language !== 'fr' && '(Individual business)'}:{' '}
		</>
	) : status === 'EIRL' ? (
		<>
			Entrepreneur individuel à responsabilité limitée{' '}
			{language !== 'fr' && '(Individual entrepreneur with limited liability)'}:{' '}
		</>
	) : status === 'EURL' ? (
		<>
			EURL - Entreprise unipersonnelle à responsabilité limitée{' '}
			{language !== 'fr' && '(Limited personal company)'}:{' '}
		</>
	) : status === 'SARL' ? (
		<>
			SARL - Société à responsabilité limitée{' '}
			{language !== 'fr' && '(Limited corporation)'}:{' '}
		</>
	) : status === 'SAS' ? (
		<>
			SAS - Société par actions simplifiées{' '}
			{language !== 'fr' && '(Simplified joint stock company)'}:{' '}
		</>
	) : status === 'SASU' ? (
		<>
			SASU - Société par action simplifiée unipersonnelle{' '}
			{language !== 'fr' && '(Simplified personal joint stock company)'}:{' '}
		</>
	) : status === 'SA' ? (
		<>SA - Société anonyme {language !== 'fr' && '(Anonymous company)'}: </>
	) : status === 'SNC' ? (
		<>SNC - Société en nom collectif {language !== 'fr' && '(Partnership)'}: </>
	) : status === 'auto-entrepreneur' ? (
		<>
			<T>Auto-entrepreneur</T>
			{language === 'fr' && ' '}:{' '}
		</>
	) : status === 'auto-entrepreneur-EIRL' ? (
		<>
			<T>Auto-entrepreneur en EIRL</T>
			{language === 'fr' && ' '}
			{':'}
		</>
	) : null

const SetMainStatus = ({
	history,
	possibleStatus,
	goBackToPreviousQuestion,
	sitePaths
}: Props) => {
	const { t, i18n } = useTranslation()
	return (
		<>
			<Helmet>
				<title>
					{t(
						'listeformejuridique.page.titre',
						'Liste des statuts juridiques pour la création de votre entreprise'
					)}
				</title>
			</Helmet>
			<h2>
				<T>Votre forme juridique</T>
			</h2>

			<ul>
				{Object.keys(filter(Boolean, possibleStatus)).map(status => (
					<li key={status}>
						<strong>
							<StatusTitle status={status} language={i18n.language} />
						</strong>{' '}
						<p>
							<StatusDescription status={status} />
						</p>
						<StatusButton status={status} history={history} />
					</li>
				))}
			</ul>
			<div className="ui__ answer-group">
				<button
					onClick={goBackToPreviousQuestion}
					className="ui__ simple small skip button left">
					← <T>Précédent</T>
				</button>
				<Link
					to={sitePaths.sécuritéSociale.index}
					className="ui__ simple small skip button">
					<T>Choisir plus tard</T> →
				</Link>
			</div>
		</>
	)
}

export default compose(
	withSitePaths,
	connect(
		state => ({ possibleStatus: possibleStatusSelector(state) }),
		{ goBackToPreviousQuestion }
	)
)(SetMainStatus)
