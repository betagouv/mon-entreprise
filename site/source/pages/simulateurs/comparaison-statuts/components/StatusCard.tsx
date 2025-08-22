import { ReactNode } from 'react'
import { Trans } from 'react-i18next'
import { styled } from 'styled-components'

import { StatutTag, StatutType } from '@/components/StatutTag'
import { CardContainer, Emoji, Grid, Tooltip } from '@/design-system'

type StatutCardType = {
	statut: StatutType[]
	footerContent?: ReactNode
	isBestOption?: boolean
	children: ReactNode
}

const StatusCard = ({
	statut: status,
	children,
	footerContent,
	isBestOption,
}: StatutCardType) => {
	return (
		<StyledCardContainer $inert>
			<CardBody>
				<Grid container spacing={1}>
					{status.map((statusString) => (
						<Grid item key={statusString}>
							<StatutTag statut={statusString} text="acronym" showIcon />
						</Grid>
					))}
				</Grid>
				{children}
			</CardBody>
			{isBestOption && (
				<StyledTooltip tooltip={<Trans>Option la plus avantageuse.</Trans>}>
					<StyledEmoji emoji="🥇" />
				</StyledTooltip>
			)}
			{footerContent && <CardFooter>{footerContent}</CardFooter>}
		</StyledCardContainer>
	)
}

export default StatusCard

const StyledCardContainer = styled(CardContainer)`
	position: relative;
	align-items: flex-start;
	padding: 0;
`

const StyledTooltip = styled(Tooltip)`
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
