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

import { Emoji } from '@/design-system/emoji'

type DateFieldsWithPickerProps = RADateValue &
	RADatePickerProps<RADateValue> & {
		label: string
	}

export function DateFieldWithPicker({ label }: DateFieldsWithPickerProps) {
	const { i18n } = useTranslation()
	const language = i18n.language as 'fr' | 'en'

	const dateFormatHelperText = language === 'fr' ? 'JJ/MM/AAAA' : 'DD/MM/YYYY'

	return (
		<RADatePicker>
			<RALabel>{label}</RALabel>
			<RAText slot="description">{` (${dateFormatHelperText})`}</RAText>

			<RAGroup>
				<RADateInput>
					{(segment) => <RADateSegment segment={segment} />}
				</RADateInput>

				<RAButton>
					<Emoji emoji="📅" />
				</RAButton>
			</RAGroup>

			<RAPopover>
				<RADialog>
					<RACalendar>
						<header>
							<RAHeading />

							<RAButton slot="previous">-</RAButton>
							<RAButton slot="next">+</RAButton>
						</header>

						<RACalendarGrid>
							{(date) => <RACalendarCell date={date} />}
						</RACalendarGrid>
					</RACalendar>
				</RADialog>
			</RAPopover>
		</RADatePicker>
	)
}
