import { describe, expect, it } from 'vitest'
import { hexToHSL } from './hexToHSL'

describe('hexToHSL conversion', function () {
	it('convert value', () => {
		expect(hexToHSL('#CC0000')).to.be.deep.equal([360, 100, 40])
	})
})
