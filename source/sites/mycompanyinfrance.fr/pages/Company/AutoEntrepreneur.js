/* @flow */
import { isAutoentrepreneur } from 'Actions/companyStatusActions'
import { React, T } from 'Components'
import { compose } from 'ramda'
import Helmet from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import CompanyStatusNavigation from './CompanyStatusNavigation'

import type { TFunction } from 'react-i18next'

type Props = {
	isAutoentrepreneur: (?boolean) => void,
	t: TFunction
}

const Autoentrepreneur = ({ isAutoentrepreneur, t }: Props) => (
	<>
		<Helmet>
			<title>{t('autoentrepreneur.page.titre', 'Auto-entrepreneur')}</title>
			<meta
				name="description"
				content={
					<T k="autoentrepreneur.page.description">
						Un auto-entrepreneur bénéficie d'un système simplifié de déclaration
						et de paiement, pour lesquelles les impôts et cotisations sociales
						sont basés sur le chiffre d'affaires réalisé chaque mois. C'est un
						choix intéressant si vous n'avez pas besoin de beaucoup de capital
						et que vous souhaitez démarrer rapidement.
					</T>
				}
			/>
		</Helmet>
		<h2>
			<T k="autoentrepreneur.titre">Auto-entrepreneur</T>
		</h2>
		<T k="autoentrepreneur.description">
			<p>
				Un auto-entrepreneur bénéficie d'un régime simplifié de déclaration et
				de paiement, pour lequel l'impôt et les cotisations sociales sont basés
				sur le chiffre d'affaires réalisé chaque mois. Disponible pour les
				entreprises dont le chiffre d'affaires annuel ne dépasse pas 70 000 €
				pour les prestataires de services ou 170 000 € lorsque l'activité
				principale est la vente de biens, la restauration ou la fourniture de
				logements.
			</p>
			<p>C'est un choix intéressant si :</p>
			<ul>
				<li>
					Vous n'avez pas besoin de beaucoup de capital et de dépenses
					importantes pour mener votre activité
				</li>
				<li>
					Vous voulez tester la viabilité de votre modèle (activité ou projet)
				</li>
				<li>
					Vous souhaitez un minimum de formalités (ou démarches) pour commencer
				</li>
			</ul>
			<p>
				<strong>Note</strong> : Certaines activités sont exclues de ce statut (
				<a href="https://www.afecreation.fr/pid10375/pour-quelles-activites.html#principales-exclusions">
					{' '}
					voir la liste
				</a>
				). Certaines activités sont réglementées avec une qualification ou une
				expérience professionnelle (
				<a href="https://www.afecreation.fr/pid316/activites-reglementees.html">
					voir la liste
				</a>
				).
			</p>
			<p>
				Pour tous les autres cas, il est conseillé de choisir le statut de{' '}
				<strong>l'Entreprise Individuelle</strong> avec le régime fiscal du réel
				simplifié.
			</p>
		</T>
		<div className="ui__ answer-group">
			<button
				onClick={() => {
					isAutoentrepreneur(true)
				}}
				className="ui__ button">
				<T>Auto-entrepreneur</T>
			</button>
			<button
				onClick={() => {
					isAutoentrepreneur(false)
				}}
				className="ui__ button">
				<T>Entreprise Individuelle</T>
			</button>
		</div>
		<CompanyStatusNavigation onSkip={() => isAutoentrepreneur(null)} />
	</>
)

export default compose(
	withTranslation(),
	connect(
		null,
		{ isAutoentrepreneur }
	)
)(Autoentrepreneur)
