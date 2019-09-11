/* @flow */
import { defineDirectorStatus } from 'Actions/companyStatusActions'
import { React, T } from 'Components'
import SchemeComparaison from 'Components/SchemeComparaison'
import { compose } from 'ramda'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import CompanyStatusNavigation from './CompanyStatusNavigation'
import type { DirectorStatus } from 'Types/companyTypes'
import type { TFunction } from 'react-i18next'

type Props = {
	defineDirectorStatus: (?DirectorStatus) => void,
	sitePaths: Object
}
const DefineDirectorStatus = ({ defineDirectorStatus }: Props) => {
	const { t } = useTranslation()
	return (
		<>
			<Helmet>
				<title>
					{t('statut du dirigeant.titre', 'Définir le statut du dirigeant')}
				</title>
				<meta
					name="description"
					content={t(
						'statut du dirigeant.page.description',
						`Ce choix est important parce qu'il détermine le régime de sécurité sociale et la couverture sociale de l'administrateur. Chaque option a des implications juridiques et conduit à un statut différent lors de la création de votre entreprise.`
					)}
				/>
			</Helmet>
			<h2>
				<T k="statut du dirigeant.titre">Définir le statut du dirigeant</T>
			</h2>
			<T k="statut du dirigeant.description">
				<p>
					Ce choix est important car il détermine le régime de sécurité sociale
					et la couverture sociale du dirigeant. Le montant et les modalités de
					paiement des cotisations sociales sont également impactés.
				</p>
				<div className="ui__ full-width">
					<SchemeComparaison hideAutoEntrepreneur />
				</div>
			</T>

			<CompanyStatusNavigation onSkip={() => defineDirectorStatus(null)} />
		</>
	)
}

export default compose(
	connect(
		null,
		{ defineDirectorStatus }
	)
)(DefineDirectorStatus)
