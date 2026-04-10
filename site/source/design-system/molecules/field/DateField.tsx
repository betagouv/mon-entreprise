import 'react-day-picker/dist/style.css'

import { autoUpdate, flip, offset, useFloating } from '@floating-ui/react-dom'
import { format as formatDate, isValid, parse } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'
import FocusTrap from 'focus-trap-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useId } from 'react-aria'
import { DayPicker, useInput } from 'react-day-picker'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { useOnClickOutside } from '@/hooks/useOnClickOutside'

import { Button } from '../../buttons'
import { Emoji } from '../../emoji'
import { splitAriaProps } from '../../splitAriaProps'
import { Body } from '../../typography/paragraphs'
import TextField from './TextField'

export interface DateFieldProps {
	id?: string
	defaultSelected?: Date
	onChange?: (value?: Date) => void
	label?: string
	'aria-labelledby'?: string
	type?: 'date passé' | 'date' | 'date futur'
}

export const DateField = (props: DateFieldProps) => {
	const { aria: ariaProps, rest } = splitAriaProps(props)
	const { id, defaultSelected, label, onChange, type = 'date' } = rest

	const { t, i18n } = useTranslation()
	const language = i18n.language as 'fr' | 'en'

	const [isChangeOnce, setIsChangeOnce] = useState(false)
	const [selected, setSelected] = useState<Date>()
	const [isOpen, setIsOpen] = useState(false)

	const ariaControlsId = useId()

	const format = 'dd/MM/y'
	const locale = language === 'fr' ? fr : enUS
	const { inputProps, dayPickerProps } = useInput({
		defaultSelected,
		format,
		required: true,
		locale,
		fromDate: type === 'date futur' ? new Date() : new Date('1800-01-01'),
		toDate:
			type === 'date passé'
				? new Date()
				: new Date(`${new Date().getFullYear() + 100}-01-01`),
	})

	const [inputValue, setInputValue] = useState<string>(
		inputProps.value as string
	)

	const { x, y, strategy, refs } = useFloating<HTMLButtonElement>({
		open: isOpen,
		placement: 'bottom',
		middleware: [offset(8), flip()],
		whileElementsMounted: autoUpdate,
	})

	useOnClickOutside(refs.floating, () => setIsOpen(false))

	const close = useCallback(() => {
		setIsOpen((open) => {
			if (open) {
				refs.reference?.current?.focus()
			}

			return false
		})
	}, [refs.reference])

	const handleInputChange = (value: string) => {
		setIsOpen(false)
		setIsChangeOnce(true)
		setInputValue(value)
		const date = parse(value, format, new Date())
		if (isValid(date) && date.getFullYear() > 1800) {
			setSelected(date)
			onChange?.(date)
		} else {
			setSelected(undefined)
			onChange?.()
		}
	}

	const handleButtonPress = () => {
		setIsOpen((open) => !open)
	}

	const handleDaySelect = useCallback(
		(date?: Date) => {
			setSelected(date)
			if (date) {
				const value = formatDate(date, format, { locale })
				setInputValue(value)
				close()
				onChange?.(date)
			} else {
				setInputValue('')
				onChange?.()
			}
		},
		[close, onChange]
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
		<div>
			<Wrapper>
				<TextField
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...ariaProps}
					id={id}
					label={label}
					aria-label={t(
						'design-system.date-picker.label',
						'Champ de date au format jours/mois/année'
					)}
					placeholder={language === 'fr' ? 'JJ/MM/AAAA' : 'DD/MM/YYYY'}
					value={inputValue}
					onChange={handleInputChange}
					onBlur={(e) => {
						inputProps.onBlur?.(e)
					}}
					onFocus={(e) => {
						inputProps.onFocus?.(e)
					}}
					errorMessage={
						isChangeOnce && selected === undefined
							? t(
									'design-system.date-picker.error.invalid-date',
									'Format de date invalide, le format attendu est JJ/MM/AAAA (par exemple, 11/06/1991).'
							  )
							: ''
					}
				/>
				<StyledButton
					ref={refs.setReference}
					onPress={handleButtonPress}
					type="button"
					aria-haspopup="dialog"
					size="XXS"
					aria-expanded={isOpen}
					aria-controls={isOpen ? ariaControlsId : undefined}
					aria-label={t(
						'design-system.date-picker.open-selector',
						'Ouvrir le sélecteur de date'
					)}
				>
					<Emoji emoji="📅" aria-hidden />
				</StyledButton>
			</Wrapper>

			{isOpen && (
				<FocusTrap
					active
					focusTrapOptions={{
						clickOutsideDeactivates: true,
						fallbackFocus: refs.reference.current ?? undefined,
					}}
				>
					<StyledBody
						as="div"
						id={ariaControlsId}
						tabIndex={-1}
						className="dialog-sheet"
						ref={refs.setFloating}
						style={{
							position: strategy,
							top: y ?? 0,
							left: x ?? 0,
							width: 'max-content',
						}}
						role="dialog"
						onKeyDown={(e) => {
							if (e.key === 'Escape') {
								close()
							}
						}}
						aria-label="Calendrier de sélection de date"
					>
						<DayPicker
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...dayPickerProps}
							captionLayout="dropdown-buttons"
							mode="single"
							defaultMonth={selected}
							selected={selected}
							onSelect={handleDaySelect}
							labels={{
								labelMonthDropdown: () =>
									t('design-system.date-picker.month', 'Mois'),
								labelYearDropdown: () =>
									t('design-system.date-picker.year', 'Année'),
								labelNext: () =>
									t('design-system.date-picker.next-month', 'Mois suivant'),
								labelPrevious: () =>
									t('design-system.date-picker.prev-month', 'Mois précédent'),
							}}
							locale={language === 'fr' ? fr : enUS}
							footer={
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Button
										light
										type="button"
										onPress={close}
										size="XXS"
										aria-label={t(
											'design-system.date-picker.close-selector',
											'Fermer le sélecteur de date'
										)}
									>
										{t('design-system.date-picker.close', 'Fermer')}
									</Button>
								</div>
							}
						/>
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
		theme.darkMode ? theme.elevationsDarkMode[3] : theme.elevations[3]};

	.rdp-dropdown:focus-visible:not([disabled]) + .rdp-caption_label,
	.rdp-button:focus-visible:not([disabled]) {
		background-color: ${({ theme }) =>
			theme.darkMode && theme.colors.extended.grey[600]};
	}

	.rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
		background-color: ${({ theme }) =>
			theme.darkMode && theme.colors.extended.grey[600]};
	}
`

const Wrapper = styled.div`
	width: fit-content;
	position: relative;
`

const StyledButton = styled(Button)`
	position: absolute;
	right: 0.2rem;
	top: 0.1625rem;
	width: 36px;
	height: 36px;
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		top: 0.175rem;
		width: 33px;
		height: 33px;
	}
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${({ theme }) =>
		theme.darkMode && theme.colors.bases.primary[700]};
`
