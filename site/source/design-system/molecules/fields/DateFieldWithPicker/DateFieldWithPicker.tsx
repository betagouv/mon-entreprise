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

import { Emoji } from '@/design-system/emoji'

type DateFieldsWithPickerProps = RADateValue &
	RADatePickerProps<RADateValue> & {
		label: string
	}

export function DateFieldWithPicker({ label }: DateFieldsWithPickerProps) {
	return (
		<RADatePicker>
			<RALabel>{label}</RALabel>
			<RAText slot="description"> (JJ/MM/AAAA)</RAText>

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
