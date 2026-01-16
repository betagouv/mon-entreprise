import { ComponentType, PropsWithChildren, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import {
	findChildByType,
	findChildrenByType,
} from '@/utils/react-compound-components'

import { Emoji } from '../emoji'
import { Grid } from '../layout'
import { Body } from '../typography/paragraphs'
import { CardContainer } from './Card'

export type Status = 'applicable' | 'sousConditions' | 'nonApplicable'

type StatusCardProps = {
	isBestOption?: boolean
	status?: Status
	children: ReactNode
}

export const StatusCard = ({
	children,
	isBestOption,
	status,
}: StatusCardProps) => {
	const { t } = useTranslation()

	const étiquettes = findChildrenByType(children, StatusCard.Étiquette)
	const titre = findChildByType(children, StatusCard.Titre)
	const valeurSecondaire = findChildByType(
		children,
		StatusCard.ValeurSecondaire
	)
	const complément = findChildByType(children, StatusCard.Complément)
	const actions = findChildrenByType(children, StatusCard.Action)

	const hasContent = titre || valeurSecondaire

	return (
		<StyledCardContainer $status={status}>
			<CardBody>
				{étiquettes.length > 0 && (
					<Grid container spacing={1}>
						{étiquettes}
					</Grid>
				)}
				{hasContent && (
					<StyledContentWrapper as="div" $status={status}>
						{titre}
						{valeurSecondaire}
					</StyledContentWrapper>
				)}
			</CardBody>
			{isBestOption && (
				<AbsoluteSpanTop
					title={t(
						'pages.simulateurs.comparaison-statuts.meilleure-option',
						'Option la plus avantageuse.'
					)}
				>
					<StyledEmoji emoji="🥇" />
				</AbsoluteSpanTop>
			)}
			{status === 'applicable' && (
				<AbsoluteSpanWithMargin
					title={t(
						'pages.simulateurs.comparaison-statuts.option-applicable',
						'Option applicable.'
					)}
				>
					<StyledStatusEmoji emoji="✅" />
				</AbsoluteSpanWithMargin>
			)}
			{status === 'sousConditions' && (
				<AbsoluteSpanWithMargin
					title={t(
						'pages.simulateurs.comparaison-statuts.option-sous-conditions',
						'Option applicable sous conditions.'
					)}
				>
					<StyledStatusEmoji emoji="⚠️" />
				</AbsoluteSpanWithMargin>
			)}
			{status === 'nonApplicable' && (
				<AbsoluteSpanWithMargin
					title={t(
						'pages.simulateurs.comparaison-statuts.option-non-applicable',
						'Option non applicable.'
					)}
				>
					<StyledStatusEmoji emoji="🚫" />
				</AbsoluteSpanWithMargin>
			)}
			{(complément || actions.length > 0) && (
				<CardFooter>
					{complément}
					{actions}
				</CardFooter>
			)}
		</StyledCardContainer>
	)
}

const StatusCardÉtiquette: ComponentType<PropsWithChildren> = ({
	children,
}: PropsWithChildren) => <Grid item>{children}</Grid>
StatusCardÉtiquette.displayName = 'StatusCard.Étiquette'

const StatusCardTitre: ComponentType<PropsWithChildren> = ({
	children,
}: PropsWithChildren) => <>{children}</>
StatusCardTitre.displayName = 'StatusCard.Titre'

const StatusCardValeurSecondaire: ComponentType<PropsWithChildren> = ({
	children,
}: PropsWithChildren) => (
	<StyledValeurSecondaire>{children}</StyledValeurSecondaire>
)
StatusCardValeurSecondaire.displayName = 'StatusCard.ValeurSecondaire'

const StatusCardComplément: ComponentType<PropsWithChildren> = ({
	children,
}: PropsWithChildren) => <>{children}</>
StatusCardComplément.displayName = 'StatusCard.Complément'

const StatusCardAction: ComponentType<PropsWithChildren> = ({
	children,
}: PropsWithChildren) => children
StatusCardAction.displayName = 'StatusCard.Action'

StatusCard.Étiquette = StatusCardÉtiquette
StatusCard.Titre = StatusCardTitre
StatusCard.ValeurSecondaire = StatusCardValeurSecondaire
StatusCard.Complément = StatusCardComplément
StatusCard.Action = StatusCardAction

const getStatusBackgroundColor = (
	status: Status | undefined,
	darkMode: boolean
) => {
	if (!status) return undefined

	const colors = {
		applicable: darkMode
			? 'rgba(34, 197, 94, 0.05)'
			: 'rgba(34, 197, 94, 0.03)',
		sousConditions: darkMode
			? 'rgba(234, 179, 8, 0.05)'
			: 'rgba(234, 179, 8, 0.03)',
		nonApplicable: darkMode
			? 'rgba(239, 68, 68, 0.05)'
			: 'rgba(239, 68, 68, 0.03)',
	}

	return colors[status]
}

const getStatusTitleColor = (status: Status | undefined, darkMode: boolean) => {
	if (!status) return undefined

	const colors = {
		applicable: darkMode ? 'rgb(134, 239, 172)' : 'rgb(20, 83, 45)',
		sousConditions: darkMode ? 'rgb(253, 224, 71)' : 'rgb(113, 63, 18)',
		nonApplicable: darkMode ? 'rgb(252, 165, 165)' : 'rgb(127, 29, 29)',
	}

	return colors[status]
}

const StyledCardContainer = styled(CardContainer)<{
	$status?: Status
}>`
	position: relative;
	align-items: flex-start;
	padding: 0;

	${({ $status, theme }) =>
		$status &&
		`
		background-color: ${getStatusBackgroundColor(
			$status,
			theme.darkMode
		)} !important;

		&:hover {
			background-color: ${getStatusBackgroundColor(
				$status,
				theme.darkMode
			)} !important;
			box-shadow: ${
				theme.darkMode ? theme.elevationsDarkMode[2] : theme.elevations[2]
			};
		}
	`}
`

const AbsoluteSpanTop = styled.span`
	position: absolute;
	top: 0;
	right: 1.5rem;
`

const AbsoluteSpanWithMargin = styled.span`
	position: absolute;
	top: 0.5rem;
	right: 1.5rem;
`

const StyledEmoji = styled(Emoji)`
	font-size: 1.5rem;
`

const StyledStatusEmoji = styled(Emoji)`
	font-size: 1.5rem;
`

const CardBody = styled.div`
	padding: 1.5rem;
	flex: 1;
	display: flex;
	flex-direction: column;
	width: 100%;
`

const CardFooter = styled.div`
	width: 100%;
	border-top: 1px solid ${({ theme }) => theme.colors.extended.grey[300]};
	padding: 1.5rem;
`

const StyledContentWrapper = styled(Body)<{ $status?: Status }>`
	font-size: 1.25rem;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	font-weight: 700;
	margin: 0;
	margin-top: 0.75rem;

	${({ $status, theme }) =>
		$status &&
		`
		color: ${getStatusTitleColor($status, theme.darkMode)};
	`}
`

const StyledValeurSecondaire = styled.span`
	display: block;
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: normal;
	font-size: 1rem;
	color: ${({ theme }) => theme.colors.extended.grey[700]};
	margin: 0 !important;
	margin-top: 0.5rem;
	width: 100%;
`
