import { ReactNode } from 'react'
import styled from 'styled-components'

import { CardContainer } from '@/design-system/card/Card'
import { Emoji } from '@/design-system/emoji'
import { Tag } from '@/design-system/tag'
import { Strong } from '@/design-system/typography'
import { Body } from '@/design-system/typography/paragraphs'

type StatusCardType = {
	status: ('sasu' | 'ei' | 'ae')[] | 'sasu' | 'ei' | 'ae'
	footerContent?: ReactNode
	isBestOption?: boolean
	children: ReactNode
}

const StatusCard = ({
	status,
	children,
	footerContent,
	isBestOption,
}: StatusCardType) => {
	return (
		<StyledCardContainer $inert>
			<Tag>toto</Tag>
			{isBestOption && <StyledEmoji emoji="🥇" />}
			<Body>
				<Strong>{children}</Strong>
			</Body>
		</StyledCardContainer>
	)
}

export default StatusCard

const StyledCardContainer = styled(CardContainer)`
	position: relative;
`

const StyledEmoji = styled(Emoji)`
	position: absolute;
	top: 0;
	right: 1.5rem;
`
