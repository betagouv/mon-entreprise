import { ReactNode } from 'react'
import styled from 'styled-components'

import { CardContainer } from '@/design-system/card/Card'
import { Emoji } from '@/design-system/emoji'
import { CircleIcon, HexagonIcon, TriangleIcon } from '@/design-system/icons'
import { Tag } from '@/design-system/tag'
import { Strong } from '@/design-system/typography'
import { Body } from '@/design-system/typography/paragraphs'

type StatusCardType = {
	status: ('sasu' | 'ei' | 'ae')[]
	footerContent?: ReactNode
	isBestOption?: boolean
	children: ReactNode
}

const STATUS_DATA = {
	sasu: {
		color: 'employeur',
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
}: StatusCardType) => {
	return (
		<StyledCardContainer $inert>
			{status.map((statusString) => (
				<StyledTag
					key={statusString}
					$color={STATUS_DATA[statusString].color}
					$size="sm"
				>
					<StatusTagIcon status={statusString} />
					{STATUS_DATA[statusString].label}
				</StyledTag>
			))}

			{isBestOption && <StyledEmoji emoji="🥇" />}
			<StyledBody>
				<Strong>{children}</Strong>
			</StyledBody>
		</StyledCardContainer>
	)
}

export default StatusCard

const StyledCardContainer = styled(CardContainer)`
	position: relative;
	align-items: flex-start;
`

const StyledEmoji = styled(Emoji)`
	position: absolute;
	top: 0;
	right: 1.5rem;
	font-size: 1.5rem;
`

const StyledTag = styled(Tag)<{ $color: string }>`
	svg {
	}
`

const StyledBody = styled(Body)`
	font-size: 1.25rem;
`

const StatusTagIcon = ({
	status,
	...props
}: {
	status: StatusCardType['status']
}) => {
	switch (true) {
		case status.includes('sasu'):
			return <HexagonIcon {...props} />
		case status.includes('ei'):
			return <TriangleIcon {...props} />
		case status.includes('ae'):
			return <CircleIcon {...props} />

		default:
			return ''
	}
}
