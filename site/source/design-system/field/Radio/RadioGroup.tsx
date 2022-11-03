import { useRadioGroup } from '@react-aria/radio'
import { useRadioGroupState } from '@react-stately/radio'
import { AriaRadioGroupProps } from '@react-types/radio'
import styled from 'styled-components'

import { RadioContext } from './Radio'

type RadioGroupProps = AriaRadioGroupProps & {
	children: React.ReactNode
}

export function RadioGroup(props: RadioGroupProps) {
	const { children, label } = props
	const state = useRadioGroupState(props)
	const { radioGroupProps, labelProps } = useRadioGroup(props, state)

	return (
		<div {...radioGroupProps}>
			{label && <span {...labelProps}>{label}</span>}
			<RadioGroupContainer orientation={props.orientation ?? 'vertical'}>
				<RadioContext.Provider value={state}>{children}</RadioContext.Provider>
			</RadioGroupContainer>
		</div>
	)
}

const RadioGroupContainer = styled.div<{
	orientation: 'horizontal' | 'vertical'
}>`
	display: flex;
	flex-wrap: wrap;
	flex-direction: ${({ orientation }) =>
		orientation === 'horizontal' ? 'row' : 'column'};
`
