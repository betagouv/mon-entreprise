import { SitePathsContext } from '~/components/utils/SitePathsContext'
import { Link } from '~/design-system/typography/link'
import { isNil } from 'ramda'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '~/reducers/rootReducer'
import styled from 'styled-components'
import { LegalStatusRequirements } from '~/types/companyTypes'

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

const PreviousAnswersList = styled.ul`
	font-family: ${({ theme }) => theme.fonts.main};
	display: flex;
	list-style-type: none;
	z-index: 2;
	position: relative;
	padding: 0;
	margin-bottom: -1rem;
`

const PreviousAnswersItem = styled.li`
	padding-right: 0.5rem;
	&:after {
		content: '>';
		padding-left: 0.5rem;
	}
`

export default function PreviousAnswers() {
	const sitePaths = useContext(SitePathsContext)
	const legalStatus = useSelector(
		(state: RootState) => state.inFranceApp.companyLegalStatus
	)
	if (Object.values(legalStatus).length < 1) {
		return null
	}
	return (
		<PreviousAnswersList>
			{Object.entries(legalStatus).map(
				([key, value]) =>
					!isNil(value) && (
						<PreviousAnswersItem key={key}>
							<Link
								to={
									sitePaths.créer.guideStatut[key as keyof typeof legalStatus]
								}
							>
								{requirementToText(key as any, value as any)}
							</Link>
						</PreviousAnswersItem>
					)
			)}
		</PreviousAnswersList>
	)
}
