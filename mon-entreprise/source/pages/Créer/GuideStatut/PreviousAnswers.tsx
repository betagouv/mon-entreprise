import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { isNil } from 'ramda'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import { LegalStatusRequirements } from 'Types/companyTypes'

const requirementToText = (
	key: keyof LegalStatusRequirements,
	value: string
) => {
	switch (key) {
		case 'multipleAssociates':
			return value ? (
				<Trans>Plusieurs associés</Trans>
			) : (
				<Trans>Un seul associé</Trans>
			)
		case 'soleProprietorship':
			return value ? (
				<Trans i18nKey="responsabilité.bouton2">Entreprise individuelle</Trans>
			) : (
				<Trans i18nKey="responsabilité.bouton1">Société</Trans>
			)
		case 'directorStatus':
			return value === 'SELF_EMPLOYED' ? (
				<Trans>Indépendant</Trans>
			) : (
				<Trans>Assimilé salarié</Trans>
			)
		case 'autoEntrepreneur':
			return value ? (
				<Trans>Auto-entrepreneur</Trans>
			) : (
				<Trans>Pas en auto-entrepreneur</Trans>
			)
		case 'minorityDirector':
			return value ? (
				<Trans>Gérant minoritaire</Trans>
			) : (
				<Trans>Gérant majoritaire</Trans>
			)
	}
}

export default function PreviousAnswers() {
	const sitePaths = useContext(SitePathsContext)
	const legalStatus = useSelector(
		(state: RootState) => state.inFranceApp.companyLegalStatus
	)
	if (Object.values(legalStatus).length < 1) {
		return null
	}
	return (
		<ul css="margin-bottom: -1rem;">
			{Object.entries(legalStatus).map(
				([key, value]) =>
					!isNil(value) && (
						<li key={key}>
							<Link
								to={
									sitePaths.créer.guideStatut[key as keyof typeof legalStatus]
								}
							>
								{requirementToText(key as any, value as any)}
							</Link>
						</li>
					)
			)}
		</ul>
	)
}
