/* @flow */
import { defineDirectorStatus } from 'Actions/companyStatusActions'
import { React, T } from 'Components'
import { compose } from 'ramda'
import Helmet from 'react-helmet'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import CompanyStatusNavigation from './CompanyStatusNavigation'
import type { DirectorStatus } from 'Types/companyTypes'
import type { TFunction } from 'react-i18next'

type Props = {
	defineDirectorStatus: (?DirectorStatus) => void,
	t: TFunction
}
const DefineDirectorStatus = ({ defineDirectorStatus, t }: Props) => (
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
				Ce choix est important parce qu'il détermine le régime de sécurité
				sociale et la couverture sociale du dirigeant.
			</p>
			<ul>
				<li>
					<strong>Assimilé salarié :</strong> Le dirigeant de l'entreprise est
					couvert par le régime général de la Sécurité sociale française. Les
					cotisations sont calculées sur la base de la rémunération du dirigeant
					et sont payés mensuellement. Bien qu'il soit plus coûteux, ce
					programme offre une protection sociale complète (à l'exception du
					chômage).
				</li>
				<li>
					<strong>Indépendant :</strong> Le dirigeant de l'entreprise est
					couvert par le régime de la Sécurité sociale des travailleurs
					indépendants. Les cotisations dues sont généralement calculées en
					fonction des revenus professionnels déclarés à l'administration
					fiscale. Bien que moins coûteux, ce régime offre une protection
					sociale limitée (des options supplémentaires et une assurance privée
					sont recommandées).
				</li>
			</ul>
		</T>
		<div className="ui__ answer-group">
			<button
				className="ui__ button"
				onClick={() => {
					defineDirectorStatus('SALARIED')
				}}>
				<T>Assimilé salarié</T>
			</button>
			<button
				className="ui__ button"
				onClick={() => {
					defineDirectorStatus('SELF_EMPLOYED')
				}}>
				<T>Indépendant</T>
			</button>
		</div>
		<CompanyStatusNavigation onSkip={() => defineDirectorStatus(null)} />
	</>
)

export default compose(
	withNamespaces(),
	connect(
		null,
		{ defineDirectorStatus }
	)
)(DefineDirectorStatus)
