import { T } from 'Components'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import { isNil } from 'ramda'
import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { LegalStatusRequirements } from 'Types/companyTypes'

const requirementToText = (
	key: keyof LegalStatusRequirements,
	value: string
) => {
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

export default function PreviousAnswers() {
	const sitePaths = useContext(SitePathsContext)
	const legalStatus = useSelector<any, any>(
		state => state.inFranceApp.companyLegalStatus
	)
	return (
		!!Object.values(legalStatus).length && (
			<ul css="margin-bottom: -1rem;">
				{Object.entries(legalStatus).map(
					([key, value]) =>
						!isNil(value) && (
							<li key={key}>
								<Link to={sitePaths.créer.guideStatut[key]}>
									{requirementToText(key as any, value as any)}
								</Link>
							</li>
						)
				)}
			</ul>
		)
	)
}
