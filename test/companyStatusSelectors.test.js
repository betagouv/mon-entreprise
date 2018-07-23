/* @flow */

import { expect } from 'chai'
import { nextQuestionSelector } from 'Selectors/companyStatusSelectors'
const state = companyLegalStatus => ({
	inFranceApp: {
		companyLegalStatus,
		existingCompanyDetails: null,
		checklists: { register: {}, hire: {} }
	}
})
describe('company status selectors', function() {
	describe('nextQuestionSelector', function() {
		it('should return null there is only one status possible', () => {
			const nextQuestion = nextQuestionSelector(
				state({
					liability: 'SOLE_PROPRIETORSHIP',
					directorStatus: 'SELF_EMPLOYED',
					multipleAssociates: true
				})
			)
			expect(nextQuestion).to.be.equal(null)
		})
		it('should not return null if no questions have been answered yet', () => {
			const nextQuestion = nextQuestionSelector(state({}))
			expect(nextQuestion).not.to.be.equal(null)
		})
		it('should return null if all the questions have been answered', () => {
			const nextQuestion = nextQuestionSelector(
				state({
					liability: null,
					directorStatus: null,
					microenterprise: null,
					multipleAssociates: null
				})
			)
			expect(nextQuestion).to.be.equal(null)
		})
		it('should always return a question that have not been answered yet', () => {
			let nextQuestion = nextQuestionSelector(
				state({
					directorStatus: null,
					multipleAssociates: null
				})
			)
			expect(['directorStatus', 'multipleAssociates']).not.to.contain(
				nextQuestion
			)

			nextQuestion = nextQuestionSelector(
				state({
					directorStatus: 'SALARIED',
					liability: 'LIMITED_LIABILITY'
				})
			)
			expect(['directorStatus', 'liability']).not.to.contain(nextQuestion)

			nextQuestion = nextQuestionSelector(
				state({
					multipleAssociates: true,
					liability: 'LIMITED_LIABILITY'
				})
			)
			expect(['multipleAssociates', 'liability']).not.to.contain(nextQuestion)
		})
		it('should not return a question which can lead to no matching status', () => {
			const nextQuestion = nextQuestionSelector(
				state({
					liability: 'SOLE_PROPRIETORSHIP',
					multipleAssociates: null,
					microenterprise: null,
				})
			)
			expect(nextQuestion).to.be.equal(null)
		})
		it('should return a question if it can help to shrink down the possibilities', () => {
			const nextQuestion = nextQuestionSelector(
				state({
					liability: 'LIMITED_LIABILITY',
					directorStatus: 'SALARIED'
				})
			)
			expect(nextQuestion).not.to.be.equal(null)
		})

		it('should first return the question which convey the most information (which eliminates the most statuses ) ', () => {
			const nextQuestion = nextQuestionSelector(state({}))
			expect(nextQuestion).to.be.equal('multipleAssociates')
		})
	})
})
