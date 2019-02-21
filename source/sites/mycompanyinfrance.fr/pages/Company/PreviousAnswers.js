/* @flow */
import { goToCompanyStatusChoice } from 'Actions/companyStatusActions'
import { React, T } from 'Components'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose, isNil } from 'ramda'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'

import type { LegalStatusRequirements } from 'Types/companyTypes'
const requirementToText = (key, value) => {
	switch (key) {
		case 'multipleAssociates':
			return value ? <T>Plusieurs associés</T> : <T>Un seul associé</T>
		case 'soleProprietorship':
			return value ? (
				<T T k="responsabilité.bouton2">
					Entreprise individuelle
				</T>
			) : (
				<T k="responsabilité.bouton1">Société</T>
			)
		case 'directorStatus':
			return value === 'SELF_EMPLOYED' ? (
				<T>Indépendant</T>
			) : (
				<T>Assimilé salarié</T>
			)
		case 'autoEntrepreneur':
			return value ? <T>Auto-entrepreneur</T> : <T>Pas en auto-entrepreneur</T>
		case 'minorityDirector':
			return value ? <T>Gérant minoritaire</T> : <T>Gérant majoritaire</T>
	}
}
type OwnProps = {}
type Props = LegalStatusRequirements & {
	goToCompanyStatusChoice: () => void,
	sitePaths: Object
}

const PreviousAnswers = ({
	sitePaths,
	goToCompanyStatusChoice,
	...legalStatus
}: Props) => {
	return (
		<>
			{!!Object.keys(legalStatus).length && (
				<button
					onClick={goToCompanyStatusChoice}
					className="ui__ simple small skip button left">
					⟲ <T>Recommencer</T>
				</button>
			)}
			{Object.values(legalStatus).some(answer => answer !== null) && (
				<>
					<ul>
						<Animate.fromBottom>
							{Object.entries(legalStatus).map(
								([key, value]) =>
									!isNil(value) && (
										<li key={key}>
											<Link to={sitePaths.entreprise.statutJuridique[key]}>
												{requirementToText(key, value)}
											</Link>
										</li>
									)
							)}
						</Animate.fromBottom>
					</ul>
				</>
			)}
		</>
	)
}

export default (compose(
	connect(
		state => state.inFranceApp.companyLegalStatus,
		{ goToCompanyStatusChoice }
	),
	withSitePaths
)(PreviousAnswers): React$ComponentType<OwnProps>)
