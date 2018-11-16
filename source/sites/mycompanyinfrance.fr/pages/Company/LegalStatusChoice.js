/* @flow */
import { React, T } from 'Components'
import { isNil } from 'ramda'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import sitePaths from '../../sitePaths'
import type { CompanyLegalStatus } from 'Types/companyTypes'
const requirementToText = (key, value) => {
	switch (key) {
		case 'multipleAssociates':
			return value ? <T>Plusieurs associés</T> : <T>Un seul associé</T>
		case 'liability':
			return value === 'LIMITED_LIABILITY' ? (
				<T>Responsabilité limitée</T>
			) : (
				<T>Sans responsabilité limitée</T>
			)
		case 'directorStatus':
			return value === 'SELF_EMPLOYED' ? (
				<T>Indépendant</T>
			) : (
				<T>Assimilé salarié</T>
			)
		case 'microEnterprise':
			return value ? (
				<T>Option micro-entrepreneur</T>
			) : (
				<T>Pas de régime de micro-entreprise</T>
			)
		case 'minorityDirector':
			return value ? <T>Gérant minoritaire</T> : <T>Gérant majoritaire</T>
	}
}

type Props = CompanyLegalStatus & { goToCompanyStatusChoice: () => void }

const LegalStatusChoice = ({ ...legalStatus }: Props) => {
	return (
		!!Object.keys(legalStatus).length && (
			<>
				<h2>
					<T>Vos choix : </T>
				</h2>
				<ul>
					<Animate.fromBottom>
						{Object.entries(legalStatus).map(
							([key, value]) =>
								!isNil(value) && (
									<li key={key}>
										<Link to={sitePaths().entreprise.statusJuridique[key]}>
											{requirementToText(key, value)}
										</Link>
									</li>
								)
						)}
					</Animate.fromBottom>
				</ul>
			</>
		)
	)
}

export default connect(
	state => state.inFranceApp.companyLegalStatus,
	() => ({})
)(LegalStatusChoice)
