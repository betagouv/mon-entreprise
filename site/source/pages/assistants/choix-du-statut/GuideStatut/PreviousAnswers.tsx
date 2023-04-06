import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { Link } from '@/design-system/typography/link'
import { useSitePaths } from '@/sitePaths'
import { RootState } from '@/store/reducers/rootReducer'
import { LegalStatusRequirements } from '@/types/companyTypes'

interface RequirementToTextType {
	props: {
		children: string
	}
}

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

const PreviousAnswersList = styled.nav`
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
	const location = useLocation()
	const { absoluteSitePaths } = useSitePaths()
	const legalStatus = useSelector(
		(state: RootState) => state.choixStatutJuridique.companyLegalStatus
	)

	const { t } = useTranslation()

	if (Object.values(legalStatus).length < 1) {
		return null
	}

	return (
		<PreviousAnswersList aria-label={t('Étapes du choix du statut juridique')}>
			{Object.entries(legalStatus).map(([key, value]) => {
				const textObject = requirementToText(
					key as keyof LegalStatusRequirements,
					value as string
				)
				const isCurrent =
					decodeURI(location.pathname) ===
					absoluteSitePaths.assistants['choix-du-statut'].guideStatut[
						key as keyof typeof legalStatus
					]

				return (
					value !== undefined && (
						<PreviousAnswersItem
							key={key}
							aria-current={isCurrent ? 'step' : undefined}
						>
							<Link
								to={
									absoluteSitePaths.assistants['choix-du-statut'].guideStatut[
										key as keyof typeof legalStatus
									]
								}
								aria-label={
									(isCurrent
										? t("Aller à l'étape actuelle :")
										: t("Revenir à l'étape")) +
										' ' +
										(textObject as RequirementToTextType)?.props?.children || ''
								}
								style={
									isCurrent
										? { textDecoration: 'underline' }
										: { textDecoration: 'none' }
								}
							>
								{textObject}
							</Link>
						</PreviousAnswersItem>
					)
				)
			})}
		</PreviousAnswersList>
	)
}
