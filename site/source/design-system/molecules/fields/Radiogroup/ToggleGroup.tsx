import {
	Label as RALabel,
	Radio as RARadio,
	RadioGroup as RARadioGroup,
	RadioGroupProps as RARadioGroupProps,
} from 'react-aria-components'
import { styled } from 'styled-components'

import { fieldContainerStyles, radioFieldsSharedStyles } from '../fieldsStyles'

export type ToggleOption = {
	label: string
	value: string
}

type ToggleGroupProps = RARadioGroupProps & {
	legend: string
	options: ToggleOption[]
}

export function ToggleGroup({
	legend,
	options,
	value,
	onChange,
}: ToggleGroupProps) {
	return (
		<StyledRARadioGroup
			value={value}
			onChange={onChange}
			orientation="horizontal"
		>
			<RALabel>{legend}</RALabel>

			<StyledGroupContainer>
				{options.map((option) => (
					<StyledRadioContainer>
						<StyledRARadio value={option.value} key={`key-${option.value}`}>
							{option.label}
						</StyledRARadio>
					</StyledRadioContainer>
				))}
			</StyledGroupContainer>
		</StyledRARadioGroup>
	)
}

const StyledRARadioGroup = styled(RARadioGroup)`
	${fieldContainerStyles}

	gap: ${({ theme }) => theme.spacings.xs};
`

const StyledGroupContainer = styled.div`
	display: flex;

	width: fit-content;
	border: 1px solid ${({ theme }) => theme.colors.extended.grey[500]};
	border-radius: ${({ theme }) => theme.box.borderRadius};
`

const StyledRadioContainer = styled.div`
	display: flex;

	border: 1px solid ${({ theme }) => theme.colors.extended.grey[500]};

	background: transparent;

	&:first-child {
		border-radius: ${({ theme }) => theme.box.borderRadius} 0 0
			${({ theme }) => theme.box.borderRadius};
	}

	&:last-child {
		border-radius: 0 ${({ theme }) => theme.box.borderRadius}
			${({ theme }) => theme.box.borderRadius} 0;
	}
`

const StyledRARadio = styled(RARadio)`
	${radioFieldsSharedStyles}

	&:hover {
		background: ${({ theme }) => theme.colors.bases.primary[200]};
	}

	&::before {
		transition: none;
	}

	&:hover::before {
		border-color: ${({ theme }) => theme.colors.bases.primary[200]};
	}

	&[data-selected='true']::before {
		background: ${({ theme }) => theme.colors.bases.primary[700]};
	}
`
