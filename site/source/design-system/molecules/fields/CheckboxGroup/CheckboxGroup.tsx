import {
	CheckboxGroup as RACheckboxGroup,
	Label as RALabel,
	type CheckboxGroupProps as RACheckboxGroupProps,
} from 'react-aria-components'
import { styled } from 'styled-components'

import { CheckboxField, type CheckboxOption } from '../CheckboxField'
import { fieldContainerStyles } from '../fieldsStyles'

type CheckboxGroupProps = RACheckboxGroupProps & {
	legend: string
	options: CheckboxOption[]
}

export function CheckboxGroup({ legend, options, value }: CheckboxGroupProps) {
	return (
		<StyledRACheckboxGroup value={value}>
			<RALabel>{legend}</RALabel>

			{options.map((option) => (
				<CheckboxField key={`key-${option.value}`} option={option} />
			))}
		</StyledRACheckboxGroup>
	)
}

const StyledRACheckboxGroup = styled(RACheckboxGroup)`
	${fieldContainerStyles}
`
