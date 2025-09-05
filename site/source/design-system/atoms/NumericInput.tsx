import { NumberFormatter, NumberParser } from '@internationalized/number'
import { useLocale } from '@react-aria/i18n'
import { useNumberField } from '@react-aria/numberfield'
import { NumberFieldState } from '@react-stately/numberfield'
import { AriaNumberFieldProps } from '@react-types/numberfield'
import {
	ChangeEvent,
	ChangeEventHandler,
	HTMLAttributes,
	InputHTMLAttributes,
	KeyboardEvent,
	KeyboardEventHandler,
	RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { styled } from 'styled-components'

import { omit } from '@/utils'

import {
	StyledContainer,
	StyledDescription,
	StyledErrorMessage,
	StyledInput,
	StyledInputContainer,
	StyledLabel,
} from '../molecules/field/TextField'
import { InputSuggestions, InputSuggestionsRecord } from '../suggestions'

/**
 * @internal
 * Ce composant est privé au design-system.
 * Utilisez NumberField, MontantField ou QuantitéField à la place.
 */
type NumericInputProps = Omit<
	AriaNumberFieldProps,
	'placeholder' | 'onBlur' | 'onFocus'
> & {
	name?: string
	small?: boolean
	placeholder?: number | undefined
	onChange?: (n?: number) => void
	onSubmit?: (source?: string) => void
	suggestions?: InputSuggestionsRecord<number>
	displayedUnit?: string

	// API of react-aria types is broken, we need to use the HTMLAttributes version
	onFocus?: React.HTMLAttributes<HTMLInputElement>['onFocus']
	onBlur?: React.HTMLAttributes<HTMLInputElement>['onBlur']
}

export const NumericInput = (props: NumericInputProps) => {
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
	const { onChange, onKeyDown } = useKeepCursorPositionOnUpdate(
		inputProps.onChange,
		inputProps.onKeyDown,
		props.onSubmit,
		ref
	)

	return (
		<StyledNumericInputContainer>
			<StyledInputContainer
				{...groupProps}
				$hasError={!!props.errorMessage || props.validationState === 'invalid'}
				$hasLabel={!!props.label}
				$small={props.small}
			>
				<StyledNumberInput
					{...(omit(
						props as typeof props & {
							dottedName?: string
							hideDefaultValue?: boolean
						},
						'label',
						'small',
						'formatOptions',
						'hideDefaultValue',
						'dottedName',
						'suggestions',
						'onSubmit',
						'displayedUnit'
					) as HTMLAttributes<HTMLInputElement>)}
					{...omit(inputProps, 'autoCorrect')}
					onChange={onChange}
					onKeyDown={onKeyDown}
					placeholder={
						props.placeholder != null
							? state.formatter.format(props.placeholder)
							: ''
					}
					ref={ref}
				/>

				{props.label && !props.small && (
					<StyledLabel {...labelProps}>{props.label}</StyledLabel>
				)}

				{props.displayedUnit && <Unit $small={props.small}>&nbsp;{props.displayedUnit}</Unit>}
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
			{props.suggestions && (
				<InputSuggestions
					suggestions={props.suggestions}
					onFirstClick={(value: number) => {
						props.onChange?.(value)
					}}
					onSecondClick={() => props.onSubmit?.('suggestion')}
				/>
			)}
		</StyledNumericInputContainer>
	)
}

const StyledNumericInputContainer = styled(StyledContainer)`
	max-width: 300px;
`

const StyledNumberInput = styled(StyledInput)`
	text-align: right;

	& + label + span {
		padding-top: ${({ theme }) => theme.spacings.md};
	}
`

const Unit = styled.span<{ $small?: boolean }>`
	font-size: ${({ $small }) => ($small ? '0.875rem' : '1rem')};
	line-height: 1.5rem;
	font-family: ${({ theme }) => theme.fonts.main};
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.extended.grey[800]};
	background-color: transparent;
	white-space: nowrap;
	user-select: none;
	padding-right: ${({ theme }) => theme.spacings.sm};
`

function useKeepCursorPositionOnUpdate(
	inputOnChange: ChangeEventHandler<HTMLInputElement> | undefined,
	inputOnKeyDown: KeyboardEventHandler<HTMLInputElement> | undefined,
	inputOnSubmit: ((source?: string) => void) | undefined,
	inputRef: RefObject<HTMLInputElement>
): InputHTMLAttributes<HTMLInputElement> {
	const [selection, setSelection] = useState<null | number>(null)
	const [value, setValue] = useState<string | undefined>()
	const [rerenderSwitch, toggle] = useState(false)

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
				e.key === 'Backspace' &&
				input?.value
					?.slice((input.selectionStart ?? 0) - 1, input.selectionStart ?? 0)
					.match(/[\s]/)
			) {
				setSelection(
					Math.max(
						0,
						(input.selectionStart ?? 0) - 2,
						(input.selectionEnd ?? 0) - 2
					)
				)
				toggle(!rerenderSwitch)
			}
			if (e.key === 'Enter' && inputOnSubmit) {
				e.preventDefault()
				inputOnSubmit('enter')
			}
		},
		[inputOnKeyDown, inputOnSubmit, rerenderSwitch]
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

	return { onChange, onKeyDown } satisfies InputHTMLAttributes<HTMLInputElement>
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
	props: NumericInputProps & {
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
				inputValue.match(/[\d€][,.]([\d]*[0]+)?[^\d]*$/) ||
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
