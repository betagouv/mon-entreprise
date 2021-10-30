import { useLocale } from '@react-aria/i18n'
import { useNumberField  } from '@react-aria/numberfield'

import { AriaNumberFieldProps, NumberFieldProps, NumberFieldState } from '@react-types/numberfield'
import { InputHTMLAttributes, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, {css} from 'styled-components'
import {NumberFormatter, NumberParser} from '@internationalized/number';
import {
	StyledContainer,
	StyledDescription,
	StyledErrorMessage,
	StyledInput,
	StyledInputContainer,
	StyledLabel,
	StyledSuffix,
} from './TextField'


export default function NumberField(
	props: AriaNumberFieldProps & { displayedUnit?: string; placeholder?: number, onChange: (n?: number) => void }
) {
	const { locale } = useLocale()
	const step = !props.step ? (10 ** (Math.floor(Math.log10((props.value ?? props.defaultValue ?? props.placeholder ?? 10) * 2)) - 1)) : 1
	const ref = useRef<HTMLInputElement>(null)
	const state = useSimpleNumberFieldState({
		...props,
		step,
		locale,
	}, ref)

	useKeepCursorPositionOnUpdate(ref);

	const {
		labelProps,
		inputProps,
		descriptionProps,
		errorMessageProps,
		groupProps,
	} = useNumberField({...props, step}, state, ref)

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
					withUnit={!!props.displayedUnit}
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

const StyledNumberInput = styled(StyledInput)<{withUnit: boolean}>`
	${({withUnit}) => withUnit && css`padding-right: 0 !important`};
	text-align: right;
`


function useKeepCursorPositionOnUpdate(inputRef: RefObject<HTMLInputElement>): void {
	const previousCursorPosition = useRef<number | null>(null)

	if (inputRef.current && inputRef.current.selectionStart && inputRef.current.selectionEnd) {
		previousCursorPosition.current = inputRef.current.value.length - Math.max(inputRef.current.selectionStart, inputRef.current.selectionEnd)
	}
	const inputIsFocused = inputRef.current === document.activeElement
	useEffect(() => {
		previousCursorPosition.current = null
	}, [inputIsFocused])
	useEffect(() => {
		if (!inputRef.current || !previousCursorPosition.current) {
			return
		}
		inputRef.current.selectionStart = inputRef.current.value.length - previousCursorPosition.current
		inputRef.current.selectionEnd = inputRef.current.value.length - previousCursorPosition.current
	})
}

/*
We use a different state hook than useNumberFieldState for the following reasons :
- Handling of input outside of step values (for instance, we 1423 will not be changed to 1420 if the step is 10)
- OnChange is called as the user types instead of on blur
- Handle ',' and '.' indifferently in French for the decimal separator

This version doesn't support min & max attributes yet.
*/
function useSimpleNumberFieldState(props: NumberFieldProps & {
	locale: string;
	placeholder?: number;
	step: number;
	onChange: (n?: number) => void

}): NumberFieldState {
  const numberParser = useMemo(() => new NumberParser(props.locale, props.formatOptions), [props.locale, props.formatOptions]);
	const [rawInputValue, setInputValue] = useState('')
	const numberingSystem = useMemo(() => numberParser.getNumberingSystem(rawInputValue), [numberParser, rawInputValue]);
  const formatter = useMemo(() => new NumberFormatter(props.locale, {...props.formatOptions, numberingSystem}), [props.locale, props.formatOptions, numberingSystem]);
	const [numberValue, setNumberValue] = useState<undefined | number>(props.value ?? props.defaultValue)

	const defaultInputValue = formatter.formatToParts(0).filter((part) => ['unit', 'percentSign', 'currency', 'literal'].includes(part.type)).map(part => part.value).join('')
	const inputValue = rawInputValue === '' ? defaultInputValue : rawInputValue

	const updateInputValue = useCallback((value: number | undefined) => {
		setInputValue(value === undefined ? '' : formatter.format(value))
	}, [formatter])

	const updateNumberValue = useCallback((value: number | undefined)=> {
		setNumberValue(value)
		if(value !== props.value) {
			props.onChange?.(value)
		}
	}, [setNumberValue, props])


	// Update internal state props value changes
	useEffect(() => {
		updateInputValue(props.value)
		setNumberValue(props.value)
	}, [props.value, updateInputValue])

	// Update internal state when setInputValue is called
	const handleInputValueChange = useCallback((inputValue) => {
		// Allow empty inputValue
		if (!inputValue) {
			updateInputValue(undefined)
			updateNumberValue(undefined)
			return
		}

		// Add the equivalence between , and . for decimal in french
		if (props.locale.startsWith('fr')) {
			const match = inputValue.match(/([^.]*)\.([^.]*)/)
			if (match) {
				inputValue = (`${match[1]},${match[2]}`)
			}
		}
		const parsedValue = numberParser.parse(inputValue)
		if (isNaN(parsedValue)) {
			updateInputValue(numberValue)
			return
		}
		updateNumberValue(parsedValue)

		// Handle case for partially formatted input while typing decimal numbers
		if (inputValue.match(/[\d][,.]([^\d]*$)|([\d]*[0]+$)/)) {
			setInputValue(inputValue)
			return
		}
		updateInputValue(parsedValue)

	}, [props.locale, numberParser, numberValue, updateInputValue, updateNumberValue])

	const increment = () => {
		const newValue = (numberValue ?? props.placeholder ?? 0) + props.step;
		updateInputValue(newValue)
		updateNumberValue(newValue)
	}
	const decrement = () => {
		const newValue = (numberValue ?? props.placeholder ?? 0) - props.step;
		updateInputValue(newValue)
		updateNumberValue(newValue)
	}

	return {
		numberValue,
		inputValue,
		decrement,
		increment,
		minValue:props.minValue ?? -Infinity,
		maxValue:props.maxValue ?? Infinity,
		canIncrement: true,
		canDecrement: true,
		validate: () => true,
		commit: () => {},
		setInputValue: handleInputValueChange,
	}
}
