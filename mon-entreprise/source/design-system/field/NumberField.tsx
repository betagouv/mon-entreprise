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

// TODO : list Differences with useFieldState
function useSimpleNumberFieldState(props: NumberFieldProps & {
	locale: string,
	placeholder?: number,
	step: number,
	onChange: (n?: number) => void,

}, inputRef: RefObject<HTMLInputElement>): NumberFieldState {
  const numberParser = useMemo(() => new NumberParser(props.locale, props.formatOptions), [props.locale, props.formatOptions]);

	const [inputValue, setInputValue] = useState('')

	const numberingSystem = useMemo(() => numberParser.getNumberingSystem(inputValue), [numberParser, inputValue]);
  const formatter = useMemo(() => new NumberFormatter(props.locale, {...props.formatOptions, numberingSystem}), [props.locale, props.formatOptions, numberingSystem]);

	const [numberValue, setNumberValue] = useState<undefined | number>(props.value ?? props.defaultValue)

	const updateInputValue = useCallback((value: number | undefined) => {
		const undefinedFormatted = formatter.formatToParts(0).filter((part) => ['unit', 'percentSign', 'currency', 'literal'].includes(part.type)).map(part => part.value).join('')
		setInputValue(value === undefined ? undefinedFormatted : formatter.format(value))
		if (!inputRef.current || !value) {
			return
		}
		const cursorPositionFromLast = inputRef.current.value.length - (inputRef.current.selectionEnd || 0)
		setImmediate(() => {
			if(!inputRef.current) {
				return
			}
			inputRef.current.selectionStart = inputRef.current.value.length - cursorPositionFromLast
			inputRef.current.selectionEnd = inputRef.current.value.length - cursorPositionFromLast
		})


	}, [formatter, setInputValue])

	const updateNumberValue = useCallback((value: number | undefined)=> {
		setNumberValue(value)
		if(value !== props.value) {
			props.onChange?.(value)
		}
	}, [setNumberValue, props])


	// Update internal state props value changes
	useEffect(() => {
		if (props.value === numberValue) {
			return
		}
		updateInputValue(props.value)
		setNumberValue(props.value)
	}, [props.value, numberValue, updateInputValue, setNumberValue])

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
			setInputValue(inputValue)
			return
		}
		updateNumberValue(parsedValue)
		updateInputValue(parsedValue)

	}, [props.locale, setInputValue])

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
