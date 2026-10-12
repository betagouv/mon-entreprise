import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DocumentationDeChamp } from '@/domaine/documentation/DocumentationDeChamp'
import { Situation } from '@/domaine/Situation'
import { TestProvider } from '@/test/TestProvider'

import { ComposantQuestionFournie } from './ComposantQuestionFournie'
import { QuestionFournie } from './QuestionFournie'

const documentation: DocumentationDeChamp = {
	Documentation: () => <p>Ceci est une documentation</p>,
	références: {
		'Site officiel': 'https://example.com',
		'Guide pratique': 'https://guide-pratique.fr',
	},
}

const question = (options: Partial<ComposantQuestionFournie<Situation>>) =>
	Object.assign(
		({ labelId }: { labelId?: string }) => (
			<input id="question-test" aria-labelledby={labelId} />
		),
		{
			_tag: 'QuestionFournie' as const,
			id: 'question-test',
			libellé: () => 'Who you gonna call?',
			typeRadioGroup: true,
			applicable: () => true,
			Valeur: () => null,
			...options,
		}
	) as ComposantQuestionFournie<Situation>

const renderQuestionFournie = <S extends Situation>(
	Question: ComposantQuestionFournie<S>
) => {
	render(
		<TestProvider>
			<QuestionFournie Question={Question} />
		</TestProvider>
	)
}

describe('QuestionFournie', () => {
	describe('pour une question de type radio group', () => {
		const Question = question({
			libellé: () => 'Who you gonna call?',
			typeRadioGroup: true,
		})

		it('affiche le libellé de la question', () => {
			renderQuestionFournie(Question)

			expect(screen.getByText('Who you gonna call?')).toBeInTheDocument()
		})

		it('n’affiche pas de bouton de documentation lorsque celle-ci est absente', () => {
			renderQuestionFournie(Question)

			expect(
				screen.queryByLabelText('Aide sur Who you gonna call?')
			).not.toBeInTheDocument()
		})

		it('affiche le bouton de documentation lorsque celle-ci est fournie', () => {
			const QuestionAvecDocumentation = question({
				libellé: () => 'Who you gonna call?',
				typeRadioGroup: true,
				documentation,
			})

			renderQuestionFournie(QuestionAvecDocumentation)

			expect(
				screen.getByLabelText('Aide sur Who you gonna call?')
			).toBeInTheDocument()
		})
	})

	describe('pour une question simple', () => {
		const Question = question({
			libellé: () => 'Are you talking to me?',
			typeRadioGroup: false,
		})

		it('affiche le libellé de la question', () => {
			renderQuestionFournie(Question)

			expect(screen.getByText('Are you talking to me?')).toBeInTheDocument()
		})

		it('n’affiche pas de bouton de documentation lorsque celle-ci est absente', () => {
			renderQuestionFournie(Question)

			expect(
				screen.queryByLabelText('Aide sur Are you talking to me?')
			).not.toBeInTheDocument()
		})

		it('affiche le bouton de documentation lorsque celle-ci est fournie', () => {
			const QuestionAvecDocumentation = question({
				libellé: () => 'Are you talking to me?',
				typeRadioGroup: false,
				documentation,
			})

			renderQuestionFournie(QuestionAvecDocumentation)

			expect(
				screen.getByLabelText('Aide sur Are you talking to me?')
			).toBeInTheDocument()
		})
	})
})
