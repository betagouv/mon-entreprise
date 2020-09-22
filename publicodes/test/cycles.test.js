import { expect } from 'chai'
import dedent from 'dedent-js'

import { hasCycles } from '../source/cyclesLib'

describe('Cyclic dependencies detector 3000 ™', () => {
	it('should detect the trivial formule cycle', () => {
		const rules = dedent`
			a:
				formule: a + 1
		`
		const cycles = hasCycles(rules)
		expect(cycles).to.deep.equal([['a']])
	})

	it('should detect the trivial replace cycle', () => {
		const rules = dedent`
			a:
				remplace: a
		`
		const cycles = hasCycles(rules)
		expect(cycles).to.deep.equal([['a']])
	})

	it('should detect nested and parallel formule cycles', () => {
		const rules = dedent`
			a:
				formule: b + 1
			b:
				formule: c + d + 1
			c:
				formule: a + 1
			d:
				formule: b + 1
		`
		const cycles = hasCycles(rules)
		expect(cycles).to.deep.equal([['d', 'c', 'b', 'a']])
	})

	it('should not detect 1 level formule + remplace', () => {
		const rules = dedent`
			b:
				formule: c + 1
				remplace: c
			c:
				formule: 0
		`
		const cycles = hasCycles(rules)
		expect(cycles).to.be.empty
	})

	it('should detect a 2 levels formuleX2 + remplace (but why? 😢)', () => {
		const rules = dedent`
			a:
				formule: b + 1
				remplace: c
			b:
				formule: c + 1
			c:
				formule: 0
		`
		const cycles = hasCycles(rules)
		expect(cycles).to.deep.equal([['c', 'b', 'a']])
	})
})
