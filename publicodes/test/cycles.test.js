import { expect } from 'chai'
import dedent from 'dedent-js'
import { cyclesInDependenciesGraph } from '../source/AST/graph'

describe('Cyclic dependencies detectron 3000 ™', () => {
	it('should detect the trivial formule cycle', () => {
		const rules = dedent`
			a:
				formule: a + 1
		`
		const cycles = cyclesInDependenciesGraph(rules)
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
		const cycles = cyclesInDependenciesGraph(rules)
		expect(cycles).to.deep.equal([['a','b','c','d']])
	})


	it('should not detect formule cycles due to parent dependancy', () => {
		const rules = dedent`
			a:
				formule: b + 1
			a . b:
				formule: 3
		`
		const cycles = cyclesInDependenciesGraph(rules)
		expect(cycles).to.deep.equal([])
	})


	it('should not detect cycles due to replacement', () => {
		const rules = dedent`
			a:
				formule: b + 1
			a . b:
				formule: 3
			a . c: 
				remplace: b
				formule: a
		`
		const cycles = cyclesInDependenciesGraph(rules)
		expect(cycles).to.deep.equal([['a', 'a . c']])
	})
})
