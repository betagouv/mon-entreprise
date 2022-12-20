import { NumberFormatter, NumberParser } from '@internationalized/number'
import { useLocale } from '@react-aria/i18n'
import { useNumberField } from '@react-aria/numberfield'
import { NumberFieldState } from '@react-stately/numberfield'
import { AriaNumberFieldProps } from '@react-types/numberfield'
import {
	ChangeEvent,
	HTMLAttributes,
	InputHTMLAttributes,
	KeyboardEvent,
	RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import styled, { css } from 'styled-components'

import { omit } from '@/utils'

import {
	StyledContainer,
	StyledDescription,
	StyledErrorMessage,
	StyledInput,
	StyledInputContainer,
	StyledLabel,
	StyledSuffix,
} from './TextField'

type NumberFieldProps = Omit<AriaNumberFieldProps, 'placeholder'> & {
	name?: string
	displayedUnit?: string
	small?: boolean
	placeholder?: number
	onChange?: (n?: number) => void
	isLight?: boolean
}

export default function NumberField(props: NumberFieldProps) {
	const { locale } = useLocale()
	const step = !props.step
		? 10 **
		  Math.max(
				Math.floor(
					Math.log10(
						Math.abs(
							props.value ?? props.defaultValue ?? props.placeholder ?? 10
						) * 2
					)
				) - 1,
				0
		  )
		: 1

	const ref = useRef<HTMLInputElement>(null)
	const state = useSimpleNumberFieldState({
		...props,
		step,
		locale,
	})

	const {
		labelProps,
		inputProps,
		descriptionProps,
		errorMessageProps,
		groupProps,
	} = useNumberField(
		{ ...props, step } as AriaNumberFieldProps,
		state as NumberFieldState,
		ref
	)
	const inputWithCursorHandlingProps = useKeepCursorPositionOnUpdate(
		inputProps,
		ref
	)

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

	delete inputWithCursorHandlingProps.autoCorrect

	return (
		<StyledNumberFieldContainer>
			<StyledInputContainer
				{...groupProps}
				hasError={!!props.errorMessage || props.validationState === 'invalid'}
				hasLabel={!!props.label}
				small={props.small}
				isLight={props?.isLight}
			>
				<StyledNumberInput
					{...(omit(props, 'label') as HTMLAttributes<HTMLInputElement>)}
					{...inputWithCursorHandlingProps}
					placeholder={
						props.placeholder != null
							? state.formatter.format(props.placeholder)
							: ''
					}
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
				<StyledErrorMessage {...errorMessageProps} role="alert">
					{props.errorMessage}
				</StyledErrorMessage>
			)}
			{props.description && (
				<StyledDescription {...descriptionProps}>
					{props.description}
				</StyledDescription>
			)}
		</StyledNumberFieldContainer>
	)
}
const StyledNumberFieldContainer = styled(StyledContainer)`
	max-width: 300px;
`

const StyledUnit = styled(StyledSuffix)`
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[200]
			: theme.colors.extended.grey[600]};
	background-color: transparent;
	padding-left: 0 !important;
	white-space: nowrap;
`

const StyledNumberInput = styled(StyledInput)<{
	withUnit: boolean
	isLight?: boolean
}>`
	${({ withUnit }) =>
		withUnit &&
		css`
			padding-right: 0 !important;
		`};
	text-align: right;
`

function useKeepCursorPositionOnUpdate(
	inputProps: InputHTMLAttributes<HTMLInputElement>,
	inputRef: RefObject<HTMLInputElement>
): InputHTMLAttributes<HTMLInputElement> {
	const [selection, setSelection] = useState<null | number>(null)
	const [value, setValue] = useState<string | undefined>()
	const [rerenderSwitch, toggle] = useState(false)
	const { onChange: inputOnChange, onKeyDown: inputOnKeyDown } = inputProps
	const onChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const input = e.target
			setValue(input.value)
			setSelection(
				Math.max(0, input.selectionStart ?? 0, input.selectionEnd ?? 0)
			)
			toggle(!rerenderSwitch)
			inputOnChange?.(e)
		},
		[inputOnChange, rerenderSwitch]
	)
	const onKeyDown = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			inputOnKeyDown?.(e)
			const input = e.target as HTMLInputElement | undefined
			if (
				!(
					e.key === 'Backspace' &&
					input?.value
						?.slice((input.selectionStart ?? 0) - 1, input.selectionStart ?? 0)
						.match(/[\s]/)
				)
			) {
				return
			}
			setSelection(
				Math.max(
					0,
					(input.selectionStart ?? 0) - 2,
					(input.selectionEnd ?? 0) - 2
				)
			)
			toggle(!rerenderSwitch)
		},
		[inputOnKeyDown, rerenderSwitch]
	)
	useEffect(() => {
		const input = inputRef.current
		if (!input || selection === null) {
			return
		}

		let adjustedSelection = selection
		if (value && input.value) {
			adjustedSelection += input.value.length - value.length
		}
		input.selectionStart = Math.max(adjustedSelection, 0)
		input.selectionEnd = Math.max(adjustedSelection, 0)
	}, [inputRef, selection, value, rerenderSwitch])

	return { ...inputProps, onChange, onKeyDown }
}

/*
We use a different state hook than useNumberFieldState for the following reasons :
- Handling of input outside of step values (for instance, we 1423 will not be changed to 1420 if the step is 10)
- OnChange is called as the user types instead of on blur
- Handle ',' and '.' indifferently in French for the decimal separator
- Handle undefined as possible value (instead of using NaN)

This version doesn't support min & max attributes yet.
*/
function useSimpleNumberFieldState(
	props: NumberFieldProps & {
		locale: string
		step: number
	}
): Omit<NumberFieldState, 'numberValue'> & {
	numberValue: number | undefined
	formatter: NumberFormatter
} {
	const numberParser = useMemo(
		() => new NumberParser(props.locale, props.formatOptions),
		[props.locale, props.formatOptions]
	)
	const [rawInputValue, setInputValue] = useState<string | undefined>()
	const numberingSystem = useMemo(
		() => numberParser.getNumberingSystem(rawInputValue ?? ''),
		[numberParser, rawInputValue]
	)
	const formatter = useMemo(
		() =>
			new NumberFormatter(props.locale, {
				...props.formatOptions,
				numberingSystem,
			}),
		[props.locale, props.formatOptions, numberingSystem]
	)
	const [numberValue, setNumberValue] = useState<undefined | number>(
		props.value ?? props.defaultValue
	)

	const defaultInputValue = formatter
		.formatToParts(0)
		.filter((part) =>
			['unit', 'percentSign', 'currency', 'literal'].includes(part.type)
		)
		.map((part) => part.value)
		.join('')

	const inputValue =
		rawInputValue === undefined && numberValue !== undefined
			? formatter.format(numberValue)
			: rawInputValue === '' || (!rawInputValue && props.placeholder == null)
			? defaultInputValue
			: rawInputValue ?? ''

	const updateInputValue = useCallback(
		(value: number | undefined) => {
			setInputValue(value === undefined ? '' : formatter.format(value))
		},
		[formatter]
	)

	const updateNumberValue = useCallback(
		(value: number | undefined) => {
			setNumberValue(value)
			if (value !== props.value) {
				props.onChange?.(value)
			}
		},
		[setNumberValue, props]
	)

	// Update internal state props value changes
	useEffect(() => {
		if (props.value === numberValue) {
			return
		}
		updateInputValue(props.value)
		setNumberValue(props.value)
	}, [props.value, updateInputValue, numberValue])

	// Update internal state when setInputValue is called
	const handleInputValueChange = useCallback(
		(inputValue: string) => {
			// Allow empty inputValue
			if (!inputValue || defaultInputValue === inputValue) {
				updateInputValue(undefined)
				updateNumberValue(undefined)

				return
			}

			// Add the equivalence between , and . for decimal in french
			if (props.locale.startsWith('fr')) {
				const match = inputValue.match(/([^.]*)\.([^.]*)/)
				if (match) {
					inputValue = `${match[1]},${match[2]}`
				}
			}
			const parsedValue = numberParser.parse(inputValue)
			if (isNaN(parsedValue)) {
				updateInputValue(numberValue)

				return
			}
			updateNumberValue(parsedValue)

			if (
				// Handle case for partially formatted input while typing decimal numbers
				inputValue.match(/[\d][,.]([\d]*[0]+)?[^\d]*$/) ||
				// Handle case for 000015
				inputValue.match(/^[^\d]*0([0]+|[\d\s,.]+)[^\d]*$/)
			) {
				setInputValue(inputValue)

				return
			}

			updateInputValue(parsedValue)
		},
		[
			props.locale,
			numberParser,
			numberValue,
			updateInputValue,
			updateNumberValue,
			defaultInputValue,
		]
	)

	const increment = () => {
		const newValue = (numberValue ?? props.placeholder ?? 0) + (props.step || 0)
		updateInputValue(newValue)
		updateNumberValue(newValue)
	}
	const decrement = () => {
		const newValue = (numberValue ?? props.placeholder ?? 0) - (props.step || 0)
		updateInputValue(newValue)
		updateNumberValue(newValue)
	}

	return {
		numberValue,
		inputValue,
		decrement,
		increment,
		minValue: props.minValue ?? -Infinity,
		maxValue: props.maxValue ?? Infinity,
		canIncrement: true,
		canDecrement: true,
		validate: () => true,
		commit: () => {
			numberValue === undefined
				? setInputValue(numberValue)
				: updateInputValue(numberValue)
		},
		incrementToMax: () => null,
		decrementToMin: () => null,
		setInputValue: handleInputValueChange,
		formatter,
	}
}
