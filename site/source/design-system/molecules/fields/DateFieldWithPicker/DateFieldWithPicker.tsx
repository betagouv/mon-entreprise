import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import {
	Button as RAButton,
	Calendar as RACalendar,
	CalendarCell as RACalendarCell,
	CalendarGrid as RACalendarGrid,
	DateInput as RADateInput,
	DatePicker as RADatePicker,
	DateSegment as RADateSegment,
	Dialog as RADialog,
	Group as RAGroup,
	Heading as RAHeading,
	Label as RALabel,
	Popover as RAPopover,
	Text as RAText,
	type DatePickerProps as RADatePickerProps,
	type DateValue as RADateValue,
} from 'react-aria-components'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Emoji } from '@/design-system/emoji'

import {
	fieldInputStyles,
	fieldLabelStyles,
	fieldTransition,
	labelAndInputContainerStyles,
} from '../fieldsStyles'

type DateFieldsWithPickerProps = RADateValue &
	RADatePickerProps<RADateValue> & {
		defaultSelected?: Date
		label: string
	}

export function DateFieldWithPicker({
	defaultSelected,
	label,
}: DateFieldsWithPickerProps) {
	const { i18n } = useTranslation()
	const language = i18n.language as 'fr' | 'en'

	const dateFormatHelperText = language === 'fr' ? 'JJ/MM/AAAA' : 'DD/MM/YYYY'

	const defaultDateValue = defaultSelected
		? parseDate(defaultSelected?.toISOString().slice(0, 10))
		: today(getLocalTimeZone())

	return (
		<StyledRADatePicker defaultValue={defaultDateValue}>
			<StyledLabelAndInputContainer>
				<StyledLabelContainer>
					<RALabel>{label}</RALabel>
					<RAText slot="description">{` (${dateFormatHelperText})`}</RAText>
				</StyledLabelContainer>

				<StyledRAGroup>
					<RADateInput>
						{(segment) => <RADateSegment segment={segment} />}
					</RADateInput>

					<StyledRAButton>
						<Emoji emoji="📅" />
					</StyledRAButton>
				</StyledRAGroup>
			</StyledLabelAndInputContainer>

			<RAPopover>
				<RADialog>
					<StyledRACalendar>
						<header>
							<RAHeading />

							<div>
								<RAButton slot="previous">&lt;</RAButton>
								<RAButton slot="next">&gt;</RAButton>
							</div>
						</header>

						<RACalendarGrid>
							{(date) => <RACalendarCell date={date} />}
						</RACalendarGrid>
					</StyledRACalendar>
				</RADialog>
			</RAPopover>
		</StyledRADatePicker>
	)
}

const StyledRADatePicker = styled(RADatePicker)`
	font-family: ${({ theme }) => theme.fonts.main};
`

const StyledLabelAndInputContainer = styled.div`
	${labelAndInputContainerStyles}
`

const StyledLabelContainer = styled.div`
	${fieldLabelStyles}
`

const StyledRAGroup = styled(RAGroup)`
	${fieldInputStyles}

	position: relative;
	display: flex;
	justify-content: space-between;

	[role='spinbutton'] {
		border-radius: 2px;
		outline: transparent solid 2px;

		&:focus {
			outline-color: ${({ theme }) =>
				theme.darkMode
					? theme.colors.bases.primary[100]
					: theme.colors.bases.primary[700]};
		}
	}
`

const StyledRAButton = styled(RAButton)`
	position: absolute;
	right: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;

	width: 2.25rem;
	height: 2.25rem;
	border: none;
	border-radius: 50%;
	outline: transparent solid 1px;

	background: ${({ theme }) => theme.colors.bases.primary[700]};

	&:focus {
		outline-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.bases.primary[100]
				: theme.colors.bases.primary[700]};
		outline-offset: ${({ theme }) => theme.spacings.xxs};
		outline-width: ${({ theme }) => theme.spacings.xxs};
	}
`

const StyledRACalendar = styled(RACalendar)`
	z-index: 10;

	padding: ${({ theme }) => theme.spacings.md};
	padding-top: 0;
	border-radius: ${({ theme }) => theme.box.borderRadius};
	box-shadow: ${({ theme }) =>
		theme.darkMode ? theme.elevationsDarkMode[2] : theme.elevations[2]};

	font-family: ${({ theme }) => theme.fonts.main};

	background: ${({ theme }) => theme.colors.extended.grey[200]};

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	button[slot='previous'],
	button[slot='next'] {
		width: ${({ theme }) => theme.spacings.xl};
		height: ${({ theme }) => theme.spacings.xl};
		border: none;
		border-radius: 50%;

		font-size: 1.25rem;
		background: transparent;

		${fieldTransition}

		&:hover,
		&:focus {
			background: ${({ theme }) => theme.colors.bases.primary[200]};
		}
	}

	.react-aria-CalendarHeaderCell,
	.react-aria-CalendarCell {
		padding: ${({ theme }) => theme.spacings.xs};
		border-radius: 50%;

		text-align: center;

		${fieldTransition}

		&:hover,
		&:focus {
			background: ${({ theme }) => theme.colors.bases.primary[200]};
		}

		&[aria-disabled='true'] {
			color: ${({ theme }) => theme.colors.extended.grey[500]};
		}
	}
`
