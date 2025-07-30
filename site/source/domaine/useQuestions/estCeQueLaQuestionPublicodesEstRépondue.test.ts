import règles from 'modele-social'
import { describe, expect, it } from 'vitest'

import { engineFactory } from '@/components/utils/EngineContext'
import { QuestionRépondue } from '@/store/reducers/simulation.reducer'

import { estCeQueLaQuestionPublicodesEstRépondue } from './estCeQueLaQuestionPublicodesEstRépondue'

describe('estCeQueLaQuestionPublicodesEstRépondue', () => {
	const engine = engineFactory(règles)

	describe('pour une question simple', () => {
		it('retourne true si la question est dans la liste des questions répondues', () => {
			const questionsRépondues: QuestionRépondue[] = [
				{ règle: 'entreprise . imposition', applicable: true },
			]
			const estRépondue = estCeQueLaQuestionPublicodesEstRépondue(
				engine,
				questionsRépondues
			)

			expect(estRépondue('entreprise . imposition')).toBe(true)
		})

		it("retourne false si la question n'est pas dans la liste des questions répondues", () => {
			const questionsRépondues: QuestionRépondue[] = []
			const estRépondue = estCeQueLaQuestionPublicodesEstRépondue(
				engine,
				questionsRépondues
			)

			expect(estRépondue('entreprise . imposition')).toBe(false)
		})
	})

	describe('pour une question "plusieurs possibilités"', () => {
		it('retourne true si au moins une sous-règle est répondue', () => {
			const questionsRépondues: QuestionRépondue[] = [
				{ règle: 'entreprise . activités . artisanale', applicable: true },
			]
			const estRépondue = estCeQueLaQuestionPublicodesEstRépondue(
				engine,
				questionsRépondues
			)

			expect(estRépondue('entreprise . activités')).toBe(true)
		})

		it('retourne true si plusieurs sous-règles sont répondues', () => {
			const questionsRépondues: QuestionRépondue[] = [
				{ règle: 'entreprise . activités . artisanale', applicable: true },
				{ règle: 'entreprise . activités . commerciale', applicable: true },
			]
			const estRépondue = estCeQueLaQuestionPublicodesEstRépondue(
				engine,
				questionsRépondues
			)

			expect(estRépondue('entreprise . activités')).toBe(true)
		})

		it("retourne false si aucune sous-règle n'est répondue", () => {
			const questionsRépondues: QuestionRépondue[] = []
			const estRépondue = estCeQueLaQuestionPublicodesEstRépondue(
				engine,
				questionsRépondues
			)

			expect(estRépondue('entreprise . activités')).toBe(false)
		})

		it('retourne false si des questions non liées sont répondues', () => {
			const questionsRépondues: QuestionRépondue[] = [
				{ règle: 'entreprise . imposition', applicable: true },
			]
			const estRépondue = estCeQueLaQuestionPublicodesEstRépondue(
				engine,
				questionsRépondues
			)

			expect(estRépondue('entreprise . activités')).toBe(false)
		})
	})
})
