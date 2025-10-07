import { ReactNode } from 'react'
import { ComponentType, PropsWithChildren, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { StatutTag, StatutType } from '@/components/StatutTag'
import { CardContainer, Grid } from '@/design-system'
import { Body, CardContainer, Emoji, Grid } from '@/design-system'
import {
	findChildByType,
	findChildrenByType,
} from '@/utils/react-compound-components'

type StatusCardProps = {
	children: ReactNode
}

const StatusCard = ({ children }: StatusCardProps) => {
	const { t } = useTranslation()

	const étiquettes = findChildrenByType(children, StatusCard.Étiquette)
	const contenu = findChildByType(children, StatusCard.Contenu)
	const compléments = findChildrenByType(children, StatusCard.Complément)
	const actions = findChildrenByType(children, StatusCard.Action)

	return (
		<StyledCardContainer inert>
			<CardBody>
				{étiquettes.length > 0 && (
					<Grid container spacing={1}>
						{étiquettes}
					</Grid>
				)}
				{contenu}
				{compléments}
			</CardBody>
			{actions.length > 0 && <CardFooter>{actions}</CardFooter>}
		</StyledCardContainer>
	)
}

const StatusCardÉtiquette: ComponentType<PropsWithChildren> = ({
	children,
}: PropsWithChildren) => <Grid item>{children}</Grid>
StatusCardÉtiquette.displayName = 'StatusCard.Étiquette'

const StatusCardContenu: ComponentType<PropsWithChildren> = ({
	children,
}: PropsWithChildren) => <StyledContenu as="div">{children}</StyledContenu>
StatusCardContenu.displayName = 'StatusCard.Contenu'

const StatusCardComplément: ComponentType<PropsWithChildren> = ({
	children,
}: PropsWithChildren) => <StyledComplément>{children}</StyledComplément>
StatusCardComplément.displayName = 'StatusCard.Complément'

const StatusCardAction: ComponentType<PropsWithChildren> = ({
	children,
}: PropsWithChildren) => children
StatusCardAction.displayName = 'StatusCard.Action'

StatusCard.Étiquette = StatusCardÉtiquette
StatusCard.Contenu = StatusCardContenu
StatusCard.Complément = StatusCardComplément
StatusCard.Action = StatusCardAction

export default StatusCard

const StyledCardContainer = styled(CardContainer)`
	position: relative;
	align-items: flex-start;
	padding: 0;
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

const StyledContenu = styled(Body)`
	font-size: 1.25rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	font-weight: 700;
	margin: 0;
	margin-top: 0.75rem;
`

const StyledComplément = styled.span`
	display: block;
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: normal;
	font-size: 1rem;
	color: ${({ theme }) => theme.colors.extended.grey[700]};
	margin-top: 0.5rem;
`
