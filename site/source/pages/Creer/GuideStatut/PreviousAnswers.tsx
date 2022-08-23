import { Link } from '@/design-system/typography/link'
import { RootState } from '@/reducers/rootReducer'
import { useSitePaths } from '@/sitePaths'
import { LegalStatusRequirements } from '@/types/companyTypes'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

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
	const { absoluteSitePaths } = useSitePaths()
	const legalStatus = useSelector(
		(state: RootState) => state.choixStatutJuridique.companyLegalStatus
	)
	if (Object.values(legalStatus).length < 1) {
		return null
	}

	return (
		<PreviousAnswersList>
			{Object.entries(legalStatus).map(
				([key, value]) =>
					value !== undefined && (
						<PreviousAnswersItem key={key}>
							<Link
								to={
									absoluteSitePaths.créer.guideStatut[
										key as keyof typeof legalStatus
									]
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
