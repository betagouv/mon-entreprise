import {
	Label as RALabel,
	Radio as RARadio,
	RadioGroup as RARadioGroup,
	type RadioGroupProps as RARadioGroupProps,
} from 'react-aria-components'
import { styled } from 'styled-components'

import { InfoButton } from '@/design-system/InfoButton'

import { fieldContainerStyles, radioFieldsSharedStyles } from '../fieldsStyles'

export type RadioOption = {
	description?: string
	label: string
	value: string
}

type RadioGroupProps = Pick<
	RARadioGroupProps,
	'defaultValue' | 'value' | 'onChange'
> & {
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
	${radioFieldsSharedStyles}

	&:hover::before {
		border-color: ${({ theme }) => theme.colors.bases.primary[200]};

		background: ${({ theme }) => theme.colors.bases.primary[200]};
	}

	&[data-selected='true']::before {
		background: ${({ theme }) => theme.colors.bases.primary[700]};
	}
`
