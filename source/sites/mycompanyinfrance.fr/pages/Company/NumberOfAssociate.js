/* @flow */
import { companyHasMultipleAssociates } from 'Actions/companyStatusActions'
import { React, T } from 'Components'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { SkipButton } from 'Ui/Button'

type Props = {
	companyHasMultipleAssociates: (?boolean) => void
}

const NumberOfAssociates = ({ companyHasMultipleAssociates }: Props) => (
	<>
		<Helmet>
			<title>Number of associates</title>
			<meta
				name="description"
				content="If your company only has one associate, the administrative process for creating your company in France is easier."
			/>
		</Helmet>
		<h2>
			<T k="associés.titre">Nombre d'associés</T>
		</h2>
		<p>
			<T k="associés.description">
				Une entreprise à un seul associé est plus simple à créer et gérer.
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

export default connect(
	null,
	{ companyHasMultipleAssociates }
)(NumberOfAssociates)
