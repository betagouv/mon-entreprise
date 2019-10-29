import { companyHasMultipleAssociates } from 'Actions/companyStatusActions'
import { T } from 'Components'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'

const NumberOfAssociates = ({ companyHasMultipleAssociates }) => {
	const { t } = useTranslation()
	return (
		<>
			<Helmet>
				<title>
					{t(
						'associés.page.titre',
						"Nombre d'associés pour créer une entreprise"
					)}
				</title>
				<meta
					name="description"
					content={t(
						'associés.page.description',
						"Découvrez quels status choisir en fonction du nombre d'associés participant à la création de l'entreprise."
					)}
				/>
			</Helmet>
			<h2>
				<T k="associés.titre">Seul ou à plusieurs</T>
			</h2>
			<T k="associés.description">
				<p>
					Une entreprise avec un seul associé est plus simple à créer et gérer.
					Un associé peut-être une personne physique (un individu) ou une
					personne morale (par exemple une société).
				</p>
				<p>
					Note : ce choix n'est pas définitif. Vous pouvez tout à fait commencer
					votre société seul, et accueillir de nouveaux associés au cours de
					votre développement.
				</p>
			</T>

			<div className="ui__ answer-group">
				<button
					onClick={() => {
						companyHasMultipleAssociates(false)
					}}
					className="ui__ button">
					<T k="associés.choix1">Seul</T>
				</button>
				<button
					onClick={() => {
						companyHasMultipleAssociates(true)
					}}
					className="ui__ button">
					<T k="associés.choix2">Plusieurs personnes</T>
				</button>
			</div>
		</>
	)
}

export default connect(
	null,
	{ companyHasMultipleAssociates }
)(NumberOfAssociates)
