import { format, parse } from 'date-fns/fp'

export type PublicodeDate =
	`${number}${number}/${number}${number}/${number}${number}${number}${number}`
export const publicodesStandardDateFormat = 'dd/MM/yyyy'

/**
 * @example 2024-12-31
 */
export type IsoDate =
	`${number}${number}${number}${number}-${number}${number}-${number}${number}`
export const isoDateFormat = 'yyyy-MM-dd'

type DateToPublicodeDate = (d: Date) => PublicodeDate

export const toPublicodeDate = format(
	publicodesStandardDateFormat
) as DateToPublicodeDate

type PublicodeDateToDate = (d: PublicodeDate) => Date

export const parsePublicodesDateString = parse(
	new Date(),
	publicodesStandardDateFormat
) as PublicodeDateToDate

export const parseIsoDateString = parse(new Date(), isoDateFormat)
