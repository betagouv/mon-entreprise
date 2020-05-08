import { companyHasMultipleAssociates } from 'Actions/companyStatusActions'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

export default function NumberOfAssociates() {
	const dispatch = useDispatch()
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
				<Trans i18nKey="associés.titre">Seul ou à plusieurs</Trans>
			</h2>
			<Trans i18nKey="associés.description">
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
			</Trans>

			<div className="ui__ answer-group">
				<button
					onClick={() => {
						dispatch(companyHasMultipleAssociates(false))
					}}
					className="ui__ button"
				>
					<Trans i18nKey="associés.choix1">Seul</Trans>
				</button>
				<button
					onClick={() => {
						dispatch(companyHasMultipleAssociates(true))
					}}
					className="ui__ button"
				>
					<Trans i18nKey="associés.choix2">Plusieurs personnes</Trans>
				</button>
			</div>
		</>
	)
}
