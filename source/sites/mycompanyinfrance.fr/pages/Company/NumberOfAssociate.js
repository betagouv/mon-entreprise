/* @flow */

import { companyHasMultipleAssociates } from 'Actions/companyStatusActions'
import { React, T } from 'Components'
import { compose } from 'ramda'
import Helmet from 'react-helmet'
import { withI18n } from 'react-i18next'
import { connect } from 'react-redux'
import { SkipButton } from 'Ui/Button'
import type { TFunction } from 'react-i18next'

type Props = {
	companyHasMultipleAssociates: (?boolean) => void,
	t: TFunction
}

const NumberOfAssociates = ({ companyHasMultipleAssociates, t }: Props) => (
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
			<T k="associés.titre">Nombre d'associés</T>
		</h2>
		<p>
			<T k="associés.description">
				<p>
					Une entreprise avec un seul associé est plus simple à créer et gérer.
					Un associé peut-être une personne physique (un indivu) ou une personne
					morale (par exemple une autre société).
				</p>
				<p>
					Note : ce choix n'est pas définitif. Vous pouvez tout à fait commencer
					votre société seul, et accueillir de nouveaux associés au cours de
					votre développement.
				</p>
			</T>
		</p>

		<div className="ui__ answer-group">
			<button
				onClick={() => {
					companyHasMultipleAssociates(false)
				}}
				className="ui__ button">
				<T k="associés.choix1">Un associé</T>
			</button>
			<button
				onClick={() => {
					companyHasMultipleAssociates(true)
				}}
				className="ui__ button">
				<T k="associés.choix2">Plusieurs associés</T>
			</button>
			<SkipButton onClick={() => companyHasMultipleAssociates(null)} />
		</div>
	</>
)

export default compose(
	withI18n(),
	connect(
		null,
		{ companyHasMultipleAssociates }
	)
)(NumberOfAssociates)
