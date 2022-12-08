import { AriaRadioProps } from '@react-types/radio'
import styled from 'styled-components'

import { Markdown } from '@/components/utils/markdown'
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

export const StyledRadioSkeleton = styled(RadioSkeleton)`
	flex: 1 100%;
	margin-bottom: ${({ theme }) => theme.spacings.xs};

	${VisibleRadio} {
		border-radius: var(--radius) !important;
		display: flex;
		flex: 1 100%;
		border-width: 0px;
		box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.25);
		padding: ${({ theme }) => theme.spacings.sm};
	}
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
