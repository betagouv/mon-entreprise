/* @flow */
import { directorIsInAMinority } from 'Actions/companyStatusActions';
import { React, T } from 'Components';
import { compose } from 'ramda';
import { Helmet } from 'react-helmet';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import type { TFunction } from 'react-i18next'

type Props = {
	directorIsInAMinority: (?boolean) => void,
	t: TFunction
}

const MinorityDirector = ({ directorIsInAMinority, t }: Props) => {
	return (
		<>
			<Helmet>
				<title>
					{t(
						'gérant minoritaire.page.titre',
						'Gérant majoritaire ou minoritaire'
					)}{' '}
				</title>
				<meta
					name="description"
					content={t(
						'gérant minoritaire.page.description',
						'Certaines règles particulières s\'appliquent en fonction du nombre d\'actions détenues par l\'administrateur, ce qui peut conduire à un statut différent lors de la création de votre société'
					)}
				/>
			</Helmet>
			<h2>
				<T k="gérant minoritaire.titre">Gérant majoritaire ou minoritaire</T>{' '}
			</h2>
			<T k="gérant minoritaire.description">
				<p>
					Certaines règles spéciales s'appliquent selon le nombre d'actions
					détenues.
				</p>
				<ul>
					<li>
						<strong>Gérant majoritaire</strong> : Vous êtes l'administrateur majoritaire
						(ou faite partie d'un conseil d'administration majoritaire).
				</li>
					<li>
						<strong>Gérant minoritaire</strong> : Vous êtes administrateur minoritaire ou égalitaire (ou faites partie d'un conseil d'administration
						minoritaire ou égalitaire).
					</li>
				</ul>
			</T>

			<div className="ui__ answer-group">
				<button
					onClick={() => {
						directorIsInAMinority(false)
					}}
					className="ui__ button">
					<T>Gérant majoritaire</T>
				</button>
				<button
					onClick={() => {
						directorIsInAMinority(true)
					}}
					className="ui__ button">
					<T>Gérant minoritaire</T>
				</button>
			</div>
		</>
	)
}

export default compose(
	withTranslation(),
	connect(
		null,
		{ directorIsInAMinority }
	)
)(MinorityDirector)
