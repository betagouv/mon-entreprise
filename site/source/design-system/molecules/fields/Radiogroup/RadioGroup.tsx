import {
	Label as RALabel,
	Radio as RARadio,
	RadioGroup as RARadioGroup,
	type RadioGroupProps as RARadioGroupProps,
} from 'react-aria-components'
import { styled } from 'styled-components'

import { fieldContainerStyles } from '../fieldsStyles'

type RadioGroupProps = RARadioGroupProps & {
	legend: string
	options: string[]
}

export function RadioGroup({ legend, options }: RadioGroupProps) {
	return (
		<StyledRARadioGroup>
			<StyledRALabel>{legend}</StyledRALabel>

			{options.map((option) => (
				<StyledRARadio key={option} value={option}>
					{option}
				</StyledRARadio>
			))}
		</StyledRARadioGroup>
	)
}

const StyledRARadioGroup = styled(RARadioGroup)`
	${fieldContainerStyles}

	gap: 0
`

const StyledRALabel = styled(RALabel)`
	margin-bottom: ${({ theme }) => theme.spacings.xs};
`

const StyledRARadio = styled(RARadio)`
	position: relative;
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacings.xxs};

	&::before,
	&::after {
		content: '';

		border-radius: 50%;

		cursor: pointer;

		transition: all 200ms;
	}

	&::before {
		padding: ${({ theme }) => theme.spacings.xxs};
		border: ${({ theme }) => theme.spacings.md} solid white;

		background: transparent;
	}

	&::after {
		position: absolute;

		left: ${({ theme }) => theme.spacings.sm};

		width: ${({ theme }) => theme.spacings.md};
		height: ${({ theme }) => theme.spacings.md};
		border: ${({ theme }) => theme.spacings.xxxs} solid
			${({ theme }) => theme.colors.extended.grey[600]};
	}

	&:hover::before {
		border-color: ${({ theme }) => theme.colors.bases.primary[200]};

		background: ${({ theme }) => theme.colors.bases.primary[200]};
	}

	&[data-selected='true']::before {
		background: ${({ theme }) => theme.colors.bases.primary[700]};
	}

	&[data-selected='true']::after {
		border-color: ${({ theme }) => theme.colors.bases.primary[700]};
	}
`
