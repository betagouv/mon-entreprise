import { describe, expect, it } from 'vitest'

import {
	parsePublicodesDateString,
	PublicodeDate,
	toPublicodeDate,
} from '@/domaine/Date'

describe('parsePublicodesDateString', () => {
	it('comprend 24-12-2024 comme le 24 décembre 2024', () => {
		const publiCodeDate: PublicodeDate = '24/12/2024'
		expect(parsePublicodesDateString(publiCodeDate)).toEqual(
			new Date(2024, 11, 24)
		)
	})
})

describe('toPublicodeDate', () => {
	it("écrit le 15 août 1980 comme '15/08/1980' (format Publicodes)", () => {
		expect(toPublicodeDate(new Date('1980-08-15'))).toEqual('15/08/1980')
	})
})
