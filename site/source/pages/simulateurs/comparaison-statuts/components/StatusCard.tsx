import { ReactNode, useRef } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'

import { Statut, StatutTag } from '@/components/StatutTag'
import { CardContainer } from '@/design-system/card/Card'
import { Emoji } from '@/design-system/emoji'
import { Grid } from '@/design-system/layout'
import { Tooltip } from '@/design-system/tooltip'
import { Body } from '@/design-system/typography/paragraphs'
import { generateUuid } from '@/utils'

type StatutCardType = {
	statut: Statut[]
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
	const tooltipIdRef = useRef(generateUuid())

	return (
		<StyledCardContainer $inert as="li">
			<CardBody>
				<Grid container spacing={1}>
					{status.map((statusString) => (
						<Grid item key={statusString}>
							<StatutTag statut={statusString} text="acronym" showIcon />
						</Grid>
					))}
				</Grid>

				<StyledBody as="div">{children}</StyledBody>
			</CardBody>
			{isBestOption && (
				<Tooltip
					tooltip={
						<StyledBodyTooltip
							css={`
								font-weight: normal;
							`}
						>
							<Trans>Option la plus avantageuse.</Trans>
						</StyledBodyTooltip>
					}
					id={`tooltip-option-avantageuse-${String(tooltipIdRef.current)}`}
				>
					<StyledEmoji
						emoji="🥇"
						aria-describedby={`tooltip-option-avantageuse-${String(
							tooltipIdRef.current
						)}`}
					/>
				</Tooltip>
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

const StyledEmoji = styled(Emoji)`
	position: absolute;
	top: 0;
	right: 1.5rem;
	font-size: 1.5rem;
`

const StyledBody = styled(Body)`
	font-size: 1.25rem;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	font-weight: 700;
	margin: 0;
	margin-top: 0.75rem;
`

const CardBody = styled.div`
	padding: 1.5rem;
	width: 100%;
`

const CardFooter = styled.div`
	width: 100%;
	border-top: 1px solid ${({ theme }) => theme.colors.extended.grey[300]};
	padding: 1.5rem;
`

const StyledBodyTooltip = styled(Body)`
	color: ${({ theme }) => theme.colors.extended.grey[100]}!important;
	font-size: 0.75rem;
	margin: 0;
`
