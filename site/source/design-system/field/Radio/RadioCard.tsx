import { AriaRadioProps } from '@react-types/radio'
import { ComponentProps } from 'react'
import styled from 'styled-components'

import { Markdown } from '@/components/utils/markdown'
import { CardContainer } from '@/design-system/card/Card'
import { Emoji } from '@/design-system/emoji'

import { RadioPoint, RadioSkeleton, SpanBody, VisibleRadio } from './Radio'

const Description = styled.span`
	display: block;
	margin: 0;
	margin-top: ${({ theme }) => theme.spacings.sm};
`

const StyledRadioPoint = styled(RadioPoint)`
	align-self: baseline;
	margin-top: 0.2rem;
`

export const RadioCardSkeleton = ({
	children,
	...rest
}: ComponentProps<typeof RadioSkeleton>) => (
	<StyledCardContainer $inert={rest.isDisabled} as={RadioSkeleton} {...rest}>
		{children}
	</StyledCardContainer>
)

const StyledCardContainer = styled(CardContainer)`
	${VisibleRadio} {
		margin: 0;
		width: 100%;
		background: transparent;
		border: 2px solid transparent;
		border-radius: 0.25rem;
	}

	padding: 0;
	margin: ${({ theme }) => theme.spacings.xs} 0;
`

type RadioCardProps = AriaRadioProps & {
	value: string
	label: string
	className?: string
	description?: string
	emoji?: string
	autoFocus?: boolean
}

// TODO: isDisabled style
export function RadioCard({
	label,
	description,
	emoji,
	...props
}: RadioCardProps) {
	return (
		<RadioCardSkeleton {...props}>
			<StyledRadioPoint />
			<SpanBody>
				<span>
					{label} {emoji && <Emoji emoji={emoji} />}
				</span>
				{description && (
					<Markdown as={Description}>{description ?? ''}</Markdown>
				)}
			</SpanBody>
		</RadioCardSkeleton>
	)
}
