/* @flow */
import { isSoleProprietorship } from 'Actions/companyStatusActions'
import { React, T } from 'Components'
import { compose } from 'ramda'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import CompanyStatusNavigation from './CompanyStatusNavigation'
import type { TFunction } from 'react-i18next'

type Props = {
	isSoleProprietorship: (?boolean) => void,
	t: TFunction
}

const SoleProprietorship = ({ isSoleProprietorship, t }: Props) => (
	<>
		<Helmet>
			<title>
				{t([
					'responsabilité.page.titre',
					'Choisir entre société ou entreprise individuelle'
				])}
			</title>
			<meta
				name="description"
				content={t(
					'responsabilité.description',
					`
						Responsabilité limitée ? entreprise individuelle ? Chaque option a
						des implications juridiques et conduit à un statut différent pour la
						création de votre entreprise en France. Ce guide vous aide à choisir
						entre les différentes forme de responsabilité.
					`
				)}
			/>
		</Helmet>
		<h2>
			<T k="responsabilité.titre">Entreprise individuelle ou société ?</T>
		</h2>
		<p>
			<T k="responsabilité.intro">
				Ce choix determine votre degré de responsabilité et votre capacité à
				accueillir de nouveaux associés dans le futur{' '}
			</T>
			:
		</p>
		<ul>
			<li>
				<T k="responsabilité.entreprise-individuelle">
					<strong>Entreprise individuelle : </strong>
					Une activité économique exercée par une seule personne physique, en
					son nom propre. Moins de formalités, mais plus de risques en cas de
					faillite, car votre patrimoine personnel peut être mis à contribution.{' '}
					<strong>
						Vous ne pouvez pas accueillir de nouveaux associés en entreprise
						individuelle.
					</strong>
				</T>
			</li>

			<li>
				<T k="responsabilité.société">
					<strong>Société : </strong>
					Vous ne pouvez pas être tenu personnellement responsable des dettes ou
					obligations de la société. En revanche, les démarches de création sont
					un peu plus lourdes, puisqu'elles incluent notamment la rédaction de
					statuts et le dépôt d'un capital.
				</T>
			</li>
		</ul>
		<div className="ui__ answer-group">
			<button
				onClick={() => {
					isSoleProprietorship(true)
				}}
				className="ui__ button">
				<T k="responsabilité.bouton2">Entreprise individuelle</T>
			</button>
			<button
				onClick={() => {
					isSoleProprietorship(false)
				}}
				className="ui__ button">
				<T k="responsabilité.bouton1">Société</T>
			</button>
		</div>
		<CompanyStatusNavigation onSkip={() => isSoleProprietorship(null)} />
		{/* this is an economic activity conducted by a single natural person, in his own name ; */}
		{/* Company  : This is an economic activity conducted by a single partner - single member company with limited liability (EURL) - or several partners (limited liability company (SARL), public limited company (SA), simplified joint-stock company (SAS)...). */}
	</>
)

export default compose(
	withTranslation(),
	connect(
		null,
		{ isSoleProprietorship }
	)
)(SoleProprietorship)
