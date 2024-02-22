import { format, parse } from 'date-fns/fp'

export const publicodesStandardDateFormat = 'dd/MM/yyyy'

export const formatDate = format(publicodesStandardDateFormat)

export const parsePublicodesDateString = parse(
	new Date(),
	publicodesStandardDateFormat
)
