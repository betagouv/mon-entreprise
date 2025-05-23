/* eslint-disable no-unused-expressions */
/* eslint-disable vitest/valid-expect */
import { describe, expect, it } from 'vitest'

import { tauxEffortHoraire } from './calcul'

describe('CMG', () => {
	describe('tauxEffortHoraire', () => {
		it('pour une garde AMA avec 3 enfants à charge', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'AMA',
				enfantsÀCharge: {
					total: 3,
					AeeH: 0,
				},
			})

			expect(résultat).to.be.equal(0.0406)
		})
		it('pour une garde GED avec 3 enfants à charge', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'GED',
				enfantsÀCharge: {
					total: 3,
					AeeH: 0,
				},
			})

			expect(résultat).to.be.equal(0.0812)
		})
		it('pour une garde AMA avec 5 enfants à charge', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'AMA',
				enfantsÀCharge: {
					total: 5,
					AeeH: 0,
				},
			})

			expect(résultat).to.be.equal(0.0305)
		})
		it('pour une garde GED avec 5 enfants à charge', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'GED',
				enfantsÀCharge: {
					total: 5,
					AeeH: 0,
				},
			})

			expect(résultat).to.be.equal(0.061)
		})
		it('pour une garde AMA avec 10 enfants à charge', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'AMA',
				enfantsÀCharge: {
					total: 10,
					AeeH: 0,
				},
			})

			expect(résultat).to.be.equal(0.0203)
		})
		it('pour une garde GED avec 10 enfants à charge', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'GED',
				enfantsÀCharge: {
					total: 10,
					AeeH: 0,
				},
			})

			expect(résultat).to.be.equal(0.0406)
		})
		it('pour une garde AMA avec 3 enfants à charge dont 2 concernés par l’AeeH', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'AMA',
				enfantsÀCharge: {
					total: 3,
					AeeH: 2,
				},
			})

			expect(résultat).to.be.equal(0.0203)
		})
		it('pour une garde GED avec 3 enfants à charge dont 2 concernés par l’AeeH', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'GED',
				enfantsÀCharge: {
					total: 3,
					AeeH: 2,
				},
			})

			expect(résultat).to.be.equal(0.0406)
		})
		it('pour une garde AMA avec 10 enfants à charge dont 2 concernés par l’AeeH', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'AMA',
				enfantsÀCharge: {
					total: 10,
					AeeH: 2,
				},
			})

			expect(résultat).to.be.equal(0.0203)
		})
		it('pour une garde GED avec 10 enfants à charge dont 2 concernés par l’AeeH', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'GED',
				enfantsÀCharge: {
					total: 10,
					AeeH: 2,
				},
			})

			expect(résultat).to.be.equal(0.0406)
		})
	})
})
