import { ComponentType, PropsWithChildren, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import {
	findChildByType,
	findChildrenByType,
} from '@/utils/react-compound-components'

import { Body, CardContainer, Emoji, Grid } from '..'

type StatusCardProps = {
	isBestOption?: boolean
	children: ReactNode
}

export const StatusCard = ({ children, isBestOption }: StatusCardProps) => {
	const { t } = useTranslation()

	const étiquettes = findChildrenByType(children, StatusCard.Étiquette)
	const titre = findChildByType(children, StatusCard.Titre)
	const valeur = findChildByType(children, StatusCard.Valeur)
	const valeurSecondaire = findChildByType(
		children,
		StatusCard.ValeurSecondaire
	)
	const complément = findChildByType(children, StatusCard.Complément)
	const actions = findChildrenByType(children, StatusCard.Action)

	const hasContent = titre || valeur || valeurSecondaire

	return (
		<StyledCardContainer $inert>
			<CardBody>
				{étiquettes.length > 0 && (
					<Grid container spacing={1}>
						{étiquettes}
					</Grid>
				)}
				{hasContent && (
					<StyledContentWrapper as="div">
						{titre}
						{valeur}
						{valeurSecondaire}
					</StyledContentWrapper>
				)}
			</CardBody>
			{isBestOption && (
				<AbsoluteSpan
					title={t(
						'pages.simulateurs.comparaison-statuts.meilleure-option',
						'Option la plus avantageuse.'
					)}
				>
					<StyledEmoji emoji="🥇" />
				</AbsoluteSpan>
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

const StatusCardValeur: ComponentType<PropsWithChildren> = ({
	children,
}: PropsWithChildren) => <>{children}</>
StatusCardValeur.displayName = 'StatusCard.Valeur'

const StatusCardValeurSecondaire: ComponentType<PropsWithChildren> = ({
	children,
}: PropsWithChildren) => <StyledValeurSecondaire>{children}</StyledValeurSecondaire>
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
StatusCard.Valeur = StatusCardValeur
StatusCard.ValeurSecondaire = StatusCardValeurSecondaire
StatusCard.Complément = StatusCardComplément
StatusCard.Action = StatusCardAction

const StyledCardContainer = styled(CardContainer)`
	position: relative;
	align-items: flex-start;
	padding: 0;
`

const AbsoluteSpan = styled.span`
	position: absolute;
	top: 0;
	right: 1.5rem;
`
const StyledEmoji = styled(Emoji)`
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

const StyledContentWrapper = styled(Body)`
	font-size: 1.25rem;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	font-weight: 700;
	margin: 0;
	margin-top: 0.75rem;
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
