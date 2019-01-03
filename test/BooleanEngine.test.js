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
	describe('collectMissings', () => {
		it('should return missing variables with their score when unknown', () => {
			engine.addRule(new Rules.Or('x', 'y'))
			engine.addRule(new Rules.Or('y', 'z'))
			const missings = engine.evaluate('x')
			expect(missings).to.be.an('object')
			expect(missings).to.include({ x: 1, y: 0.5 })
		})
		it('should not return variable that are not correlated with the target', () => {
			engine.addRule(new Rules.Or('x', 'y'))
			engine.addRule(
				new Rules.OnePossibilityAmong('a', 'b', 'c', 'd', 'e', 'f', 'g')
			)
			const missings = engine.evaluate('x')
			expect(missings).to.be.an('object')
			expect(missings).to.not.have.any.keys('a', 'b', 'c', 'd', 'e', 'f', 'g')
		})
		it('should not return variables that are not missing', () => {
			engine.addRule(new Rules.Or('x', 'y'))
			engine.addRule(new Rules.Or('y', 'z'))
			engine.addRule(new Rules.True('y'))
			const missings = engine.evaluate('x')
			expect(missings).to.be.an('object')
			expect(missings).to.not.have.property('y')
		})
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
