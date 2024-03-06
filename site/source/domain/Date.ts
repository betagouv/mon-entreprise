import { format, parse } from 'date-fns/fp'

export type PublicodeDate =
	`${number}${number}/${number}${number}/${number}${number}${number}${number}`
export const publicodesStandardDateFormat = 'dd/MM/yyyy'

type DateToPublicodeDate = (d: Date) => PublicodeDate

export const toPublicodeDate = format(
	publicodesStandardDateFormat
) as DateToPublicodeDate

type PublicodeDateToDate = (d: PublicodeDate) => Date

export const parsePublicodesDateString = parse(
	new Date(),
	publicodesStandardDateFormat
) as PublicodeDateToDate
