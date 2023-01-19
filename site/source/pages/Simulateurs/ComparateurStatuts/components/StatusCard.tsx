import { ReactNode } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'

import { DottedName } from '@/../../modele-social'
import { CardContainer } from '@/design-system/card/Card'
import { Emoji } from '@/design-system/emoji'
import { CircleIcon, HexagonIcon, TriangleIcon } from '@/design-system/icons'
import { Tag, TagType } from '@/design-system/tag'
import { Tooltip } from '@/design-system/tooltip'
import { Body } from '@/design-system/typography/paragraphs'

type StatusCardType = {
	status: ('sasu' | 'ei' | 'ae')[]
	footerContent?: ReactNode
	isBestOption?: boolean
	children: ReactNode
	dottedName: DottedName
}

const STATUS_DATA = {
	sasu: {
		color: 'secondary',
		label: 'Société (SASU)',
	},
	ei: {
		color: 'independant',
		label: 'Entreprise individuelle (EI)',
	},
	ae: {
		color: 'tertiary',
		label: 'Auto-entrepreneur',
	},
}

const StatusCard = ({
	status,
	children,
	footerContent,
	isBestOption,
	dottedName,
}: StatusCardType) => {
	return (
		<StyledCardContainer $inert>
			<CardBody>
				{status.map((statusString) => (
					<StyledTag
						key={statusString}
						$color={STATUS_DATA[statusString].color as TagType}
						$size="sm"
					>
						<StatusTagIcon
							style={{ marginRight: '0.25rem' }}
							status={statusString}
						/>
						{STATUS_DATA[statusString].label}
					</StyledTag>
				))}

				<StyledBody>{children}</StyledBody>
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
					id={`tooltip-option-avantageuse-${String(dottedName)}`}
				>
					<StyledEmoji
						emoji="🥇"
						aria-describedby={`tooltip-option-avantageuse-${String(
							dottedName
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

const StyledTag = styled(Tag)`
	display: inline-flex;
	&:not(:last-child) {
		margin-right: 0.5rem;
	}
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

const StatusTagIcon = ({
	status,
	...props
}: {
	status: 'sasu' | 'ei' | 'ae'
	style?: { marginRight: string }
}) => {
	switch (true) {
		case status.includes('sasu'):
			return <HexagonIcon {...props} />
		case status.includes('ei'):
			return <TriangleIcon {...props} />
		case status.includes('ae'):
			return <CircleIcon {...props} />

		default:
			return null
	}
}
