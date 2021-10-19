import { useLocale } from '@react-aria/i18n'
import { useNumberField } from '@react-aria/numberfield'
import {
	NumberFieldStateProps,
	useNumberFieldState,
} from '@react-stately/numberfield'
import { AriaNumberFieldProps } from '@react-types/numberfield'
import { InputHTMLAttributes, useCallback, useRef } from 'react'
import styled from 'styled-components'
import {
	StyledContainer,
	StyledDescription,
	StyledErrorMessage,
	StyledInput,
	StyledInputContainer,
	StyledLabel,
	StyledSuffix,
} from './TextField'

function useTweakedNumberFieldState(props: NumberFieldStateProps) {
	const state = useNumberFieldState(props)

	// 1 - Add the equivalence between , and . for decimal in french
	if (props.locale.startsWith('fr')) {
		const match = state.inputValue.match(/([^.]*)\.([^.]*)/)
		if (match) {
			state.setInputValue(`${match[1]},${match[2]}`)
		}
	}
	// const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)
	// useEffect(() => {
	// 	const clearCurrentTimeout = () => {
	// 		if (timeoutId.current) {
	// 			return clearTimeout(timeoutId.current)
	// 		}
	// 	}
	// 	clearCurrentTimeout()
	// 	timeoutId.current = setTimeout(
	// 		() =>
	// 			state.inputValue && state.validate(state.inputValue) && state.commit(),
	// 		2000
	// 	)
	// 	return clearCurrentTimeout
	// }, [state.inputValue])

	return state
}

export default function NumberField(
	props: AriaNumberFieldProps & { displayedUnit?: string }
) {
	const { locale } = useLocale()

	const state = useTweakedNumberFieldState({
		...props,
		locale,
	})

	const ref = useRef<HTMLInputElement>(null)
	const {
		labelProps,
		inputProps,
		descriptionProps,
		errorMessageProps,
		groupProps,
	} = useNumberField(props, state, ref)

	const handleClickOnUnit = useCallback(() => {
		if (!ref.current) {
			return
		}
		ref.current.focus()
		const length = ref.current.value.length * 2
		ref.current.setSelectionRange(length * 2, length * 2)
	}, [])

	const handleDoubleClickOnUnit = useCallback(() => {
		if (!ref.current) {
			return
		}
		ref.current.focus()
		const length = ref.current.value.length * 2
		ref.current.setSelectionRange(0, length * 2)
	}, [])
	return (
		<StyledContainer>
			<StyledInputContainer
				{...groupProps}
				hasError={!!props.errorMessage || props.validationState === 'invalid'}
				hasLabel={!!props.label}
			>
				<StyledNumberInput
					{...(inputProps as InputHTMLAttributes<HTMLInputElement>)}
					placeholder={props.placeholder ?? ''}
					ref={ref}
				/>
				{props.displayedUnit && (
					<StyledUnit
						onClick={handleClickOnUnit}
						onDoubleClick={handleDoubleClickOnUnit}
					>
						&nbsp;{props.displayedUnit}
					</StyledUnit>
				)}

				{props.label && (
					<StyledLabel {...labelProps}>{props.label}</StyledLabel>
				)}
			</StyledInputContainer>
			{props.errorMessage && (
				<StyledErrorMessage {...errorMessageProps}>
					{props.errorMessage}
				</StyledErrorMessage>
			)}
			{props.description && (
				<StyledDescription {...descriptionProps}>
					{props.description}
				</StyledDescription>
			)}
		</StyledContainer>
	)
}

const StyledUnit = styled(StyledSuffix)`
	color: ${({ theme }) => theme.colors.extended.grey[600]};
	padding-left: 0 !important;
	white-space: nowrap;
`

const StyledNumberInput = styled(StyledInput)`
	padding-right: 0 !important;
	text-align: right;
`
