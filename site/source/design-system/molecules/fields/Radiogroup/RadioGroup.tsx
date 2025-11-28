import {
	Label as RALabel,
	Radio as RARadio,
	RadioGroup as RARadioGroup,
	type RadioGroupProps as RARadioGroupProps,
} from 'react-aria-components'
import { styled } from 'styled-components'

import { InfoButton } from '@/design-system/InfoButton'

import {
	fieldContainerStyles,
	fieldOutlineOnFocus,
	fieldTransition,
} from '../fieldsStyles'

export type RadioOption = {
	description?: string
	label: string
	value: string
}

type RadioGroupProps = RARadioGroupProps & {
	description?: string
	legend: string
	options: RadioOption[]
}

// Ce composant ne gère plus le cas des sous-groupes de boutons radio.
// Si cela s'avère toujours nécessaire, on pourra s'inspirer du précédent composant <RadioChoiceGroup />.
export function RadioGroup({
	defaultValue = null,
	legend,
	options,
	value = null,
	onChange,
}: RadioGroupProps) {
	return (
		<StyledRARadioGroup
			defaultValue={defaultValue}
			value={value}
			onChange={onChange}
		>
			<StyledRALabel>{legend}</StyledRALabel>

			{options.map((option) => (
				<StyledRadioAndInfoButton key={`key-${option.value}`}>
					<StyledRARadio value={option.value}>{option.label}</StyledRARadio>

					{option.description && (
						<InfoButton
							description={option.description}
							title={option.label.toString()}
							light
						/>
					)}
				</StyledRadioAndInfoButton>
			))}
		</StyledRARadioGroup>
	)
}

const StyledRARadioGroup = styled(RARadioGroup)`
	${fieldContainerStyles}

	gap: 0;
`

const StyledRALabel = styled(RALabel)`
	margin-bottom: ${({ theme }) => theme.spacings.xs};
`

const StyledRadioAndInfoButton = styled.div`
	display: flex;
	align-items: center;

	button.print-hidden {
		margin-left: ${({ theme }) => theme.spacings.xxxs};
	}
`

const StyledRARadio = styled(RARadio)`
	position: relative;
	display: flex;
	align-items: center;

	margin: ${({ theme }) => theme.spacings.xxs};
	padding-right: ${({ theme }) => theme.spacings.xs};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	outline: transparent solid 1px;

	&::before,
	&::after {
		content: '';

		border-radius: 50%;

		cursor: pointer;

		${fieldTransition}
	}

	&::before {
		padding: ${({ theme }) => theme.spacings.xxs};
		border: ${({ theme }) => theme.spacings.sm} solid white;

		background: transparent;
	}

	&::after {
		position: absolute;

		left: ${({ theme }) => theme.spacings.xs};

		width: ${({ theme }) => theme.spacings.md};
		height: ${({ theme }) => theme.spacings.md};
		border: ${({ theme }) => theme.spacings.xxxs} solid
			${({ theme }) => theme.colors.extended.grey[600]};
	}

	&:hover::before {
		border-color: ${({ theme }) => theme.colors.bases.primary[200]};

		background: ${({ theme }) => theme.colors.bases.primary[200]};
	}

	&[data-focused='true'] {
		&:focus-within {
			${fieldOutlineOnFocus}
		}
	}

	&[data-selected='true']::before {
		background: ${({ theme }) => theme.colors.bases.primary[700]};
	}

	&[data-selected='true']::after {
		border-color: ${({ theme }) => theme.colors.bases.primary[700]};
	}
`
