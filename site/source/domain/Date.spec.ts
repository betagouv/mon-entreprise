import { describe, expect, it } from 'vitest'

import { formatDate, parsePublicodesDateString } from '@/domain/Date'

describe('parsePublicodesDateString', () => {
	it('comprend 24-12-2024 comme le 24 décembre 2024', () => {
		expect(parsePublicodesDateString('24/12/2024')).toEqual(
			new Date(2024, 11, 24)
		)
	})
})

describe('formatDate', () => {
	it("écrit le 15 août 1980 comme '15/08/1980' (format Publicodes)", () => {
		expect(formatDate(new Date('1980-08-15'))).toEqual('15/08/1980')
	})
})
