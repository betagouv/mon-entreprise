/* @flow */
import { expect } from 'chai'
import Engine, { Rules } from 'Engine/BooleanEngine'

describe('BooleanEngine', () => {
	let engine
	beforeEach(() => {
		engine = new Engine()
	})
	it('should solve true clause', () => {
		engine.addRule(new Rules.True('x'))
		expect(engine.evaluate('x')).to.eq(true)
	})
	it('should solve false clause', () => {
		engine.addRule(new Rules.False('x'))
		expect(engine.evaluate('x')).to.eq(false)
	})
	it('should throw if impossible', () => {
		engine.addRule(new Rules.False('x'))
		expect(() => engine.addRule(new Rules.True('x'))).to.throw(
			'Impossibilité logique'
		)
	})
	it('should return missing variables when unknown', () => {
		engine.addRule(new Rules.Or('x', 'y'))
		engine.addRule(new Rules.Or('y', 'z'))
		expect(engine.evaluate('x')).to.eq(['x'])
	})
	describe('onePossibilityAmong', () => {
		it('should solve everything when one is true', () => {
			engine.addRule(new Rules.OnePossibilityAmong('x', 'y', 'z'))
			engine.addRule(new Rules.True('x'))
			expect(engine.evaluate('y')).to.eq(false)
			expect(engine.evaluate('z')).to.eq(false)
		})
		it('should throw if impossible', () => {
			engine.addRule(new Rules.OnePossibilityAmong('x', 'y', 'z'))
			engine.addRule(new Rules.True('x'))
			expect(() => engine.addRule(new Rules.True('y'))).to.throw(
				'Impossibilité logique'
			)
		})
	})
})
