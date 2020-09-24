import { expect } from 'chai'
import dedent from 'dedent-js'
import graphlib from '@dagrejs/graphlib'
import { DependencyType } from '../source/cyclesLib/rulesDependencies'
import {
	cyclicDependencies,
	flattenOneLevelRemplaceLoops,
	GraphError
} from '../source/cyclesLib/graph'

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

describe('ROLL flatten-o-tron 2500 ™', () => {
	it('should replace 2 ROLL nodes with	4 nodes without loop', () => {
		const g = new graphlib.Graph()

		g.setEdge('b', 'c', { type: DependencyType.formule })
		g.setEdge('c', 'b', { type: DependencyType.replacedBy })

		const flattenedGraph = flattenOneLevelRemplaceLoops(g)

		expect(flattenedGraph.nodes()).to.deep.equal([
			'b [depType: 0]',
			'c [depType: 0]',
			'c [depType: 1]',
			'b [depType: 1]'
		])
		expect(flattenedGraph.edges()).to.deep.equal([
			{ v: 'b [depType: 0]', w: 'c [depType: 0]' },
			{ v: 'c [depType: 1]', w: 'b [depType: 1]' }
		])
	})

	it('should replace 2 ROLL nodes in context of a larger graph', () => {
		const g = new graphlib.Graph()

		g.setEdge('a', 'b', { type: DependencyType.formule })
		g.setEdge('a', 'c', { type: DependencyType.formule })
		g.setEdge('b', 'c', { type: DependencyType.formule })
		g.setEdge('c', 'b', { type: DependencyType.replacedBy })
		g.setEdge('b', 'd', { type: DependencyType.formule })
		g.setEdge('c', 'd', { type: DependencyType.formule })

		const flattenedGraph = flattenOneLevelRemplaceLoops(g)

		expect(flattenedGraph.nodes()).to.deep.equal([
			'a',
			'b [depType: 1]',
			'b [depType: 0]',
			'c [depType: 1]',
			'c [depType: 0]',
			'd'
		])
		expect(flattenedGraph.edges()).to.have.deep.members([
			{ v: 'a', w: 'b [depType: 0]' },
			{ v: 'a', w: 'b [depType: 1]' },
			{ v: 'a', w: 'c [depType: 0]' },
			{ v: 'a', w: 'c [depType: 1]' },
			{ v: 'b [depType: 0]', w: 'c [depType: 0]' },
			{ v: 'c [depType: 1]', w: 'b [depType: 1]' },
			{ v: 'b [depType: 0]', w: 'd' },
			{ v: 'b [depType: 1]', w: 'd' },
			{ v: 'c [depType: 0]', w: 'd' },
			{ v: 'c [depType: 1]', w: 'd' }
		])
	})

	it('should not replace any nodes in a 2-level formule + remplace loop', () => {
		const g = new graphlib.Graph()

		g.setEdge('a', 'b', { type: DependencyType.formule })
		g.setEdge('b', 'c', { type: DependencyType.formule })
		g.setEdge('c', 'a', { type: DependencyType.replacedBy })

		const flattenedGraph = flattenOneLevelRemplaceLoops(g)

		expect(flattenedGraph.nodes()).to.deep.equal(['a', 'b', 'c'])
		expect(flattenedGraph.edges()).to.deep.equal(g.edges())
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
