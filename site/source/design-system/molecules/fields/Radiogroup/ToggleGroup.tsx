import {
	Label as RALabel,
	Radio as RARadio,
	RadioGroup as RARadioGroup,
	RadioGroupProps as RARadioGroupProps,
} from 'react-aria-components'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import { DottedName } from '@/domaine/publicodes/DottedName'

import { fieldContainerStyles, radioFieldsSharedStyles } from '../fieldsStyles'

export type ToggleOption = {
	label: string
	value: string
}

type ToggleGroupProps = Pick<
	RARadioGroupProps,
	'defaultValue' | 'value' | 'onChange'
> & {
	legend: string
	options: ToggleOption[]
	ruleToExplain?: DottedName
}

export function ToggleGroup({
	defaultValue = null,
	legend,
	options,
	ruleToExplain,
	value,
	onChange,
}: ToggleGroupProps) {
	return (
		<StyledRARadioGroup
			defaultValue={defaultValue}
			value={value}
			onChange={onChange}
			orientation="horizontal"
		>
			<StyledLegendAndExplicableRuleContainer>
				<RALabel>{legend}</RALabel>

				{ruleToExplain && <ExplicableRule dottedName={ruleToExplain} />}
			</StyledLegendAndExplicableRuleContainer>

			<StyledGroupContainer>
				{options.map((option) => (
					<StyledRadioContainer key={`key-${option.value}`}>
						<StyledRARadio value={option.value}>{option.label}</StyledRARadio>
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

const StyledLegendAndExplicableRuleContainer = styled.div`
	display: flex;
	align-items: baseline;
	gap: ${({ theme }) => theme.spacings.xxs};
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
