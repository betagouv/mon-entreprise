import { AriaRadioProps } from '@react-types/radio'
import { ComponentProps } from 'react'
import styled from 'styled-components'

import { Markdown } from '@/components/utils/markdown'
import { CardContainer } from '@/design-system/card/Card'
import { Emoji } from '@/design-system/emoji'

import { LabelBody, RadioPoint, RadioSkeleton, VisibleRadio } from './Radio'

const Description = styled.span`
	display: block;
	margin: 0;
	margin-top: ${({ theme }) => theme.spacings.sm};
`

const StyledRadioPoint = styled(RadioPoint)`
	align-self: baseline;
	margin-top: 0.2rem;
`

export const StyledRadioSkeleton = ({
	children,
	...rest
}: ComponentProps<typeof RadioSkeleton>) => (
	<StyledCardContainer $inert={rest.isDisabled} as={RadioSkeleton} {...rest}>
		{children}
	</StyledCardContainer>
)

const StyledCardContainer = styled(CardContainer)`
	${VisibleRadio} {
		padding: 0;
		margin: 0;
		width: 100%;
		background: transparent;
		border: none;
	}

	margin: 0.5rem 0;
`

type RadioCardProps = AriaRadioProps & {
	value: string
	label: string
	className?: string
	description?: string
	emoji?: string
	autoFocus?: boolean
	hideRadio?: boolean
}

export function RadioCard({
	label,
	description,
	emoji,
	...props
}: RadioCardProps) {
	return (
		<StyledRadioSkeleton {...props}>
			{!props.hideRadio && <StyledRadioPoint />}
			<LabelBody as="span" $hideRadio={props.hideRadio}>
				<span>
					{label} {emoji && <Emoji emoji={emoji} />}
				</span>
				{description && (
					<Markdown as={Description}>{description ?? ''}</Markdown>
				)}
			</LabelBody>
		</StyledRadioSkeleton>
	)
}
