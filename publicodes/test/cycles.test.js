import { expect } from 'chai'
import dedent from 'dedent-js'
import graphlib from '@dagrejs/graphlib'
import { DependencyType } from '../source/cyclesLib/rulesDependencies'
import { flattenOneLevelRemplaceLoops } from '../source/cyclesLib/graph'

import { cyclicDependencies } from '../source/cyclesLib'

describe('Remplace loops flatten-o-tron 2500 ™', () => {
	it(`should replace 2 nodes referencing each other with formule and replacedBy by
	4 nodes without loop`, () => {
		const g = new graphlib.Graph()

		g.setEdge('b', 'c', { type: DependencyType.formule })
		g.setEdge('c', 'b', { type: DependencyType.replacedBy })

		const flattenedGraph = flattenOneLevelRemplaceLoops(g)
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
