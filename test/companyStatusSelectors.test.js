/* @flow */

import { expect } from 'chai'
import { nextQuestionSelector } from 'Selectors/companyStatusSelectors'
const state = companyLegalStatus => ({
	inFranceApp: {
		companyLegalStatus,
		existingCompany: null,
		companyStatusChoice: null
	}
})
describe('company status selectors', function() {
	describe('nextQuestionSelector', function() {
		it('should return null there is only one status possible', () => {
			const nextQuestion = nextQuestionSelector(
				state({
					soleProprietorship: true,
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
					soleProprietorship: null,
					directorStatus: null,
					autoEntrepreneur: null,
					multipleAssociates: null,
					minorityDirector: null
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
					soleProprietorship: false
				})
			)
			expect(['directorStatus', 'soleProprietorship']).not.to.contain(
				nextQuestion
			)

			nextQuestion = nextQuestionSelector(
				state({
					multipleAssociates: true,
					soleProprietorship: false
				})
			)
			expect(['multipleAssociates', 'soleProprietorship']).not.to.contain(
				nextQuestion
			)
		})
		it('should not return a question which can lead to no matching status', () => {
			const nextQuestion = nextQuestionSelector(
				state({
					multipleAssociates: true,
					minorityDirector: true
				})
			)
			expect(nextQuestion).to.be.equal(null)
		})
		it('should return a question if it can help to shrink down the possibilities', () => {
			const nextQuestion = nextQuestionSelector(
				state({
					soleProprietorship: false,
					directorStatus: 'SALARIED'
				})
			)
			expect(nextQuestion).not.to.be.equal(null)
		})

		it('should first return the question which convey the most information (which eliminates the most statuses ) ', () => {
			const nextQuestion = nextQuestionSelector(state({}))
			expect(nextQuestion).to.be.equal('soleProprietorship')
		})
		it('should allow to skip question', () => {
			const nextQuestion = nextQuestionSelector(
				state({
					multipleAssociates: null
				})
			)
			expect(nextQuestion).not.to.be.equal(null)
		})
	})
})
