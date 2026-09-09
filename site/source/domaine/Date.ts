import { format, formatISOWithOptions, parse } from 'date-fns/fp'
import { pipe } from 'effect'
import { isString } from 'effect/String'

export type PublicodeDate =
	`${number}${number}/${number}${number}/${number}${number}${number}${number}`
export const publicodesStandardDateFormat = 'dd/MM/yyyy'
export const publicodesStandardDateRegex = /^\d{2}\/\d{2}\/\d{4}$/
export const isPublicodesStandardDate = (
	date: unknown
): date is PublicodeDate =>
	isString(date) && publicodesStandardDateRegex.test(date)

/**
 * @example 2024-12-31
 */
export type IsoDate =
	`${number}${number}${number}${number}-${number}${number}-${number}${number}`
export const isoDateFormat = 'yyyy-MM-dd'
export const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/

export const isIsoDate = (date: unknown): date is IsoDate =>
	isString(date) && isoDateRegex.test(date)

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

export const dateToIsoDate = (date: Date): IsoDate =>
	formatISOWithOptions({ representation: 'date' }, date) as IsoDate

export const publicodesDateToIsoDate = (date: PublicodeDate): IsoDate =>
	pipe(date, parsePublicodesDateString, dateToIsoDate)

export const isoDateToPublicodesDate = (date: IsoDate): PublicodeDate =>
	pipe(date, parseIsoDateString, toPublicodeDate)
