import yaml from 'yaml'
import { expect } from 'chai'
import dedent from 'dedent-js'
import { cyclicDependencies, GraphError } from '../source/cyclesLib/graph'
import Engine from '../source/index'

describe('Naive dependencies builder', () => {
	it('catches double-dependecies', () => {
		const rules = dedent`
			aa:
				formule: a + 1
			a:
				remplace: aa
		`

		expect(() => cyclicDependencies(rules, true)).to.throw(GraphError)
	})
})

describe('Cyclic dependencies detectron 3000 ™', () => {
	it('should detect the trivial formule cycle', () => {
		const rules = dedent`
			a:
				formule: a + 1
		`
		const cycles = cyclicDependencies(rules)
		expect(cycles).to.deep.equal([['a']])
	})

	it('should detect the trivial replace cycle', () => {
		const rules = dedent`
			a:
				remplace: a
		`
		const cycles = cyclicDependencies(rules)
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
		const cycles = cyclicDependencies(rules)
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
		const cycles = cyclicDependencies(rules)
		expect(cycles).to.be.empty
	})

	it('should detect 1 level rend non applicable + remplace ❓', () => {
		const rules = dedent`
			b:
				remplace: c
			c:
				rend non applicable: b
		`
		const cycles = cyclicDependencies(rules)
		expect(cycles).to.deep.equal([['c', 'b']])
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
		const cycles = cyclicDependencies(rules)
		expect(cycles).to.deep.equal([['c', 'b', 'a']])
	})
})
