import { useRadioGroup } from '@react-aria/radio'
import { useRadioGroupState } from '@react-stately/radio'
import { AriaRadioGroupProps } from '@react-types/radio'
import { useEffect } from 'react'
import { styled } from 'styled-components'

import { RadioContext } from './Radio'

type RadioGroupProps = AriaRadioGroupProps & {
	children: React.ReactNode
}

export function RadioGroup(props: RadioGroupProps) {
	const { children, label } = props
	const state = useRadioGroupState(props)
	const { radioGroupProps, labelProps } = useRadioGroup(props, state)

	useEffect(() => {
		if (!props.value) {
			state.setSelectedValue('')
		}
	}, [props.value, state])

	return (
		<div
			{...radioGroupProps}
			onKeyDown={undefined} // Avoid react-aria focus next element (input, button, etc.) on keydown for rgaa
			aria-label={props['aria-label']}
		>
			{label && <span {...labelProps}>{label}</span>}
			<RadioGroupContainer $orientationMode={props.orientation ?? 'vertical'}>
				<RadioContext.Provider value={state}>{children}</RadioContext.Provider>
			</RadioGroupContainer>
		</div>
	)
}

const RadioGroupContainer = styled.div<{
	$orientationMode: 'horizontal' | 'vertical'
}>`
	display: flex;
	flex-wrap: wrap;
	flex-direction: ${({ $orientationMode }) =>
		$orientationMode === 'horizontal' ? 'row' : 'column'};
`
