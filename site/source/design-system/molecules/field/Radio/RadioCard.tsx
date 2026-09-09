import { AriaRadioProps } from '@react-types/radio'
import React, { ComponentProps } from 'react'
import { styled } from 'styled-components'

import { CardContainer } from '../../../card/Card'
import { Emoji } from '../../../emoji'
import { Body, SmallBody } from '../../../typography/paragraphs'
import { RadioPoint, RadioSkeleton, VisibleRadio } from './Radio'

export const RadioCardSkeleton = ({
	children,
	...rest
}: ComponentProps<typeof RadioSkeleton>) => (
	<StyledCardContainer inert={rest.isDisabled} as={RadioSkeleton} {...rest}>
		{children}
	</StyledCardContainer>
)

const StyledCardContainer = styled(CardContainer)`
	${VisibleRadio} {
		display: initial;
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
	label: React.ReactNode
	className?: string
	description?: React.ReactNode
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
		<StyledRadioCardSkeleton {...props}>
			<StyledRadioPoint />

			<div>
				<Body>
					{label} {emoji && <Emoji emoji={emoji} />}
				</Body>

				{description && <SmallBody $grey>{description}</SmallBody>}
			</div>
		</StyledRadioCardSkeleton>
	)
}

const StyledRadioCardSkeleton = styled(RadioCardSkeleton)`
	${VisibleRadio} {
		display: flex;
	}
`

const StyledRadioPoint = styled(RadioPoint)`
	margin: ${({ theme }) => theme.spacings.md};
	margin-right: ${({ theme }) => theme.spacings.md} !important;
	transform: translateY(${({ theme }) => theme.spacings.xxs});
	margin-left: 0;
	align-self: flex-start;
`
