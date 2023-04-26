import 'react-day-picker/dist/style.css'

import { format as formatDate, isValid, parse } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'
import FocusTrap from 'focus-trap-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useId } from 'react-aria'
import { DayPicker, useInput } from 'react-day-picker'
import { Trans, useTranslation } from 'react-i18next'
import { usePopper } from 'react-popper'
import styled from 'styled-components'

import { useOnClickOutside } from '@/hooks/useClickOutside'

import { Button } from '../buttons'
import { Emoji } from '../emoji'
import { Spacing } from '../layout'
import { Body } from '../typography/paragraphs'
import TextField from './TextField'

interface DateFieldProps {
	defaultSelected?: Date
	inputValue?: string
	onChange?: (value?: string) => void
	placeholder?: string
	label?: string
	'aria-label'?: string
	'aria-labelby'?: string

	autoFocus?: boolean
	isRequired?: boolean
}

export default function DateField(props: DateFieldProps) {
	const { aria: ariaProps, rest } = splitAriaProps(props)
	const { defaultSelected, placeholder = 'JJ/MM/AAAA', label, onChange } = rest

	const { t, i18n } = useTranslation()
	const language = i18n.language as 'fr' | 'en'

	const [isChangeOnce, setIsChangeOnce] = useState(false)
	const [selected, setSelected] = useState<Date>()
	const [isPopperOpen, setIsPopperOpen] = useState(false)

	const popperRef = useRef<HTMLDivElement>(null)
	const dayPickerRef = useRef<HTMLDivElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
		null
	)

	const id = useId()

	const format = 'dd/MM/y'
	const { inputProps, dayPickerProps } = useInput({
		defaultSelected,
		format,
		required: true,
		locale: language === 'fr' ? fr : enUS,
		fromDate: new Date('1800-01-01'),
		toDate: new Date(),
	})

	const [inputValue, setInputValue] = useState<string>(
		inputProps.value as string
	)

	const popper = usePopper(popperRef.current, popperElement, {
		placement: 'bottom-end',
	})

	useOnClickOutside(dayPickerRef, () => setIsPopperOpen(false))

	const closePopper = () => {
		setIsPopperOpen(false)
		buttonRef?.current?.focus()
	}

	const handleInputChange = (value: string) => {
		setIsPopperOpen(false)
		setIsChangeOnce(true)
		setInputValue(value)
		const date = parse(value, format, new Date())
		if (
			isValid(date) &&
			date.getFullYear() > 1800 &&
			date.getFullYear() <= new Date().getFullYear()
		) {
			setSelected(date)
			onChange?.(value)
		} else {
			setSelected(undefined)
			onChange?.()
		}
	}

	const handleButtonPress = () => {
		setIsPopperOpen((open) => !open)
	}

	const handleDaySelect = useCallback(
		(date?: Date) => {
			setSelected(date)
			if (date) {
				const value = formatDate(date, format)
				setInputValue(value)
				closePopper()
				onChange?.(value)
			} else {
				setInputValue('')
				onChange?.()
			}
		},
		[onChange]
	)

	const oldDefaultSelected = useRef<Date | undefined>(defaultSelected)
	useEffect(() => {
		if (
			typeof defaultSelected !== 'undefined' &&
			oldDefaultSelected.current?.getTime() !== defaultSelected.getTime()
		) {
			handleDaySelect(defaultSelected)
			oldDefaultSelected.current = defaultSelected
		}
	}, [defaultSelected, handleDaySelect])

	return (
		<div ref={containerRef}>
			<Wrapper ref={popperRef}>
				<TextField
					{...ariaProps}
					label={label}
					placeholder={placeholder}
					value={inputValue}
					onChange={(value) => {
						handleInputChange(value)
					}}
					onBlur={(e) => {
						inputProps.onBlur?.(
							e as React.FocusEvent<HTMLInputElement, Element>
						)
					}}
					onFocus={(e) => {
						inputProps.onFocus?.(
							e as React.FocusEvent<HTMLInputElement, Element>
						)
					}}
					errorMessage={
						isChangeOnce &&
						selected === undefined &&
						t(
							'design-system.date-picker.error.invalid-date',
							'Format de date invalide, le format attendu est JJ/MM/AAAA (par exemple, 11/06/1991).'
						)
					}
				/>
				<StyledButton
					ref={buttonRef}
					onPress={handleButtonPress}
					type="button"
					aria-haspopup="dialog"
					size="XXS"
					aria-expanded={isPopperOpen}
					aria-controls={isPopperOpen ? id : undefined}
					aria-label={t(
						'design-system.date-picker.open-selector',
						'Ouvrir le sélecteur de date'
					)}
				>
					<Emoji emoji="📅" aria-hidden />
				</StyledButton>
			</Wrapper>

			{isPopperOpen && (
				<FocusTrap
					active
					focusTrapOptions={{
						allowOutsideClick: true,
						clickOutsideDeactivates: true,
						escapeDeactivates: true,
					}}
				>
					<StyledBody
						as="div"
						id={id}
						tabIndex={-1}
						style={popper.styles.popper}
						className="dialog-sheet"
						{...popper.attributes.popper}
						ref={setPopperElement}
						role="dialog"
						onKeyDown={(e) => {
							if (e.key === 'Escape') {
								closePopper()
							}
						}}
						aria-label="Calendrier de selection de date"
					>
						<div
							ref={dayPickerRef}
							css={`
								text-align: center;
							`}
						>
							<DayPicker
								{...dayPickerProps}
								captionLayout="dropdown-buttons"
								mode="single"
								defaultMonth={selected}
								selected={selected}
								onSelect={handleDaySelect}
							/>
							<Button
								light
								size="XXS"
								onPress={closePopper}
								aria-label="Fermer le calendrier de selection"
							>
								<Trans>Fermer</Trans> ×
							</Button>
							<Spacing sm />
						</div>
					</StyledBody>
				</FocusTrap>
			)}
		</div>
	)
}

const StyledBody = styled(Body)`
	display: inline-block;
	z-index: 10;
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[700]
			: theme.colors.extended.grey[200]};
	box-shadow: ${({ theme }) =>
		theme.darkMode ? theme.elevationsDarkMode[2] : theme.elevations[2]};
`

const Wrapper = styled.div`
	position: relative;
`

const StyledButton = styled(Button)`
	max-width: 55px;
	right: 0;
	top: 0;
	margin: ${({ theme }) => theme.spacings.sm};
	position: absolute;
`

type OnlyAriaType<T> = {
	[K in keyof T as K extends `aria-${string}` ? K : never]: T[K]
}

/**
 * Split props into aria and rest
 * @param props
 */
const splitAriaProps = <T extends object>(props: T) =>
	Object.entries(props).reduce(
		(acc, [key, prop]) => {
			if (key.startsWith('aria-')) {
				acc.aria[key] = prop
			} else {
				acc.rest[key] = prop
			}

			return acc
		},
		{ aria: {}, rest: {} } as {
			aria: Record<string, unknown>
			rest: Record<string, unknown>
		}
	) as { aria: OnlyAriaType<T>; rest: Omit<T, keyof OnlyAriaType<T>> }
