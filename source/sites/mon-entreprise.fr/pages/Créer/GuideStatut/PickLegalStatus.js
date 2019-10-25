/* @flow */
import { React, T } from 'Components'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose, filter } from 'ramda'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { possibleStatusSelector } from 'Selectors/companyStatusSelectors'
import StatutDescription from '../StatutDescription'
import type { RouterHistory } from 'react-router'
import type { LegalStatus } from 'Selectors/companyStatusSelectors'

type Props = {
	history: RouterHistory,
	possibleStatus: { [LegalStatus]: boolean },
	goBackToPreviousQuestion: () => void,
	sitePaths: Object,
	setMainStatus: LegalStatus => void,
	language: string
}

const StatutButton = withSitePaths(
	({ statut, sitePaths }: { statut: LegalStatus, sitePaths: Object }) => {
		const { t } = useTranslation()
		return (
			<div className="ui__ answer-group">
				<Link to={sitePaths.créer[statut]} className="ui__ button">
					{statut.includes('auto-entrepreneur') ? (
						<T>Devenir</T>
					) : (
							<T>Créer une</T>
						)}{' '}
					{t(statut)}
				</Link>
			</div>
		)
	}
)

const StatutTitle = ({ statut, language }) =>
	statut === 'EI' ? (
		<>
			Entreprise individuelle {language !== 'fr' && '(Individual business)'}:{' '}
		</>
	) : statut === 'EIRL' ? (
		<>
			Entrepreneur individuel à responsabilité limitée{' '}
			{language !== 'fr' && '(Individual entrepreneur with limited liability)'}:{' '}
		</>
	) : statut === 'EURL' ? (
		<>
			EURL - Entreprise unipersonnelle à responsabilité limitée{' '}
			{language !== 'fr' && '(Limited personal company)'}:{' '}
		</>
	) : statut === 'SARL' ? (
		<>
			SARL - Société à responsabilité limitée{' '}
			{language !== 'fr' && '(Limited corporation)'}:{' '}
		</>
	) : statut === 'SAS' ? (
		<>
			SAS - Société par actions simplifiées{' '}
			{language !== 'fr' && '(Simplified joint stock company)'}:{' '}
		</>
	) : statut === 'SASU' ? (
		<>
			SASU - Société par action simplifiée unipersonnelle{' '}
			{language !== 'fr' && '(Simplified personal joint stock company)'}:{' '}
		</>
	) : statut === 'SA' ? (
		<>SA - Société anonyme {language !== 'fr' && '(Anonymous company)'}: </>
	) : statut === 'SNC' ? (
		<>SNC - Société en nom collectif {language !== 'fr' && '(Partnership)'}: </>
	) : statut === 'auto-entrepreneur' ? (
		<>
			<T>Auto-entrepreneur</T>
			{language === 'fr' && ' '}:{' '}
		</>
	) : statut === 'auto-entrepreneur-EIRL' ? (
		<>
			<T>Auto-entrepreneur en EIRL</T>
			{language === 'fr' && ' '}
			{':'}
		</>
	) : null

const SetMainStatus = ({
	history,
	possibleStatus,
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
				{Object.keys(possibleStatus).every(Boolean) ? <T> Liste des statuts juridiques </T> : <T>Votre forme juridique</T>}
			</h2>

			<ul>
				{Object.keys(filter(Boolean, possibleStatus)).map(statut => (
					<li key={statut}>
						<strong>
							<StatutTitle statut={statut} language={i18n.language} />
						</strong>{' '}
						<p>
							<StatutDescription statut={statut} />
						</p>
						<StatutButton statut={statut} history={history} />
					</li>
				))}
			</ul>

		</>
	)
}

export default compose(
	withSitePaths,
	connect(
		state => ({ possibleStatus: possibleStatusSelector(state) }),
	)
)(SetMainStatus)
