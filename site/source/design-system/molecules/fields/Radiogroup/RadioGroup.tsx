import {
	Label as RALabel,
	Radio as RARadio,
	RadioGroup as RARadioGroup,
	type RadioGroupProps as RARadioGroupProps,
} from 'react-aria-components'
import { styled } from 'styled-components'

import { InfoButton } from '@/design-system/InfoButton'

import { fieldContainerStyles } from '../fieldsStyles'

type Option = {
	description?: string
	label: string
	value: string
}

type RadioGroupProps = RARadioGroupProps & {
	description?: string
	legend: string
	options: Option[]
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
