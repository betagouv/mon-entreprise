import chai, { expect } from 'chai'
import 'mocha'
import sinon from 'sinon'
import Engine from '../source'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)

describe('When two different recalculs are nested', () => {
	const rulesYaml = `
a: 1
b: a * 2
c:
  recalcul:
    règle: b
    avec:
      a: 10
d:
  recalcul:
    règle: c
    avec:
      a: 100
`
	const sandbox = sinon.createSandbox()

	beforeEach(() => {
		sandbox.spy(console, 'warn')
	})
	afterEach(() => {
		sandbox.restore()
	})
	describe('evaluation of rule on top of the recalcul chain', () => {
		it('evaluates to null', () => {
			expect(new Engine(rulesYaml).evaluate('d').nodeValue).to.be.null
		})

		it('throws a warning', () => {
			new Engine(rulesYaml).evaluate('d')
			expect(console.warn).to.have.been.calledOnce
			expect((console.warn as any).getCall(0).args[0]).to.include(
				'recalcul imbriqué'
			)
		})
	})

	describe('evaluation of middle recalcul rule', () => {
		it('evaluates to something', () => {
			expect(new Engine(rulesYaml).evaluate('c').nodeValue).to.be.not.null
		})

		it('does not throw any warning', () => {
			new Engine(rulesYaml).evaluate('c')
			expect(console.warn).to.have.not.been.called
		})
	})
})

describe('When rule recalculing itself', () => {
	const rulesYaml = `
a: 100 €
r:
  produit:
    assiette: a
    taux: 50%
  plafond:
    recalcul:
      avec:
        a: 1000 €
`
	const sandbox = sinon.createSandbox()

	beforeEach(() => {
		sandbox.spy(console, 'warn')
	})
	afterEach(() => {
		sandbox.restore()
	})
	describe('evaluation of rule', () => {
		it('evaluates properly', () => {
			expect(new Engine(rulesYaml).evaluate('r').nodeValue).to.eq(50)
		})

		it('does not throw any warning', () => {
			new Engine(rulesYaml).evaluate('r')
			expect(console.warn).to.have.not.been.called
		})
	})
})
