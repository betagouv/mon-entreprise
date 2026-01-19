import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MontantField } from './MontantField'
import { eurosParAn, eurosParMois, eurosParTrimestre } from '@/domaine/Montant'

describe('MontantField', () => {
	it('affiche "par mois" quand l\'unité est €/mois', () => {
		render(
			<MontantField
				unité="€/mois"
				value={eurosParMois(2000)}
				onChange={() => {}}
			/>
		)

		// Vérifie que le suffixe "par mois" est présent dans l'input
		const input = screen.getByDisplayValue('2000')
		expect(input).toBeInTheDocument()

		// Cherche le libellé affiché à côté de l'input
		const parent = input.closest('div')
		expect(parent?.textContent).toContain('par mois')
	})

	it('affiche "par trimestre" quand l\'unité est €/trimestre', () => {
		render(
			<MontantField
				unité="€/trimestre"
				value={eurosParTrimestre(6000)}
				onChange={() => {}}
			/>
		)

		// Vérifie que le suffixe "par trimestre" est présent
		const input = screen.getByDisplayValue('6000')
		expect(input).toBeInTheDocument()

		const parent = input.closest('div')
		expect(parent?.textContent).toContain('par trimestre')
	})

	it('affiche "par an" quand l\'unité est €/an', () => {
		render(
			<MontantField
				unité="€/an"
				value={eurosParAn(24000)}
				onChange={() => {}}
			/>
		)

		// Vérifie que le suffixe "par an" est présent
		const input = screen.getByDisplayValue('24000')
		expect(input).toBeInTheDocument()

		const parent = input.closest('div')
		expect(parent?.textContent).toContain('par an')
	})

	it('affiche correctement les trois périodes cohérentes (mensuel, trimestriel, annuel)', () => {
		const { rerender } = render(
			<MontantField
				unité="€/mois"
				value={eurosParMois(2000)}
				onChange={() => {}}
			/>
		)

		// Mensuel : 2000 €/mois
		let input = screen.getByDisplayValue('2000')
		expect(input.closest('div')?.textContent).toContain('par mois')

		// Trimestre : 6000 €/trimestre (2000 × 3)
		rerender(
			<MontantField
				unité="€/trimestre"
				value={eurosParTrimestre(6000)}
				onChange={() => {}}
			/>
		)
		input = screen.getByDisplayValue('6000')
		expect(input.closest('div')?.textContent).toContain('par trimestre')

		// Annuel : 24000 €/an (2000 × 12)
		rerender(
			<MontantField
				unité="€/an"
				value={eurosParAn(24000)}
				onChange={() => {}}
			/>
		)
		input = screen.getByDisplayValue('24000')
		expect(input.closest('div')?.textContent).toContain('par an')
	})

	it('n\'affiche aucun suffixe quand l\'unité est €', () => {
		render(
			<MontantField
				unité="€"
				value={{ valeur: 100, unité: '€' }}
				onChange={() => {}}
			/>
		)

		const input = screen.getByDisplayValue('100')
		const parent = input.closest('div')

		// Vérifier qu'il n'y a pas de "par xxx" dans le texte
		expect(parent?.textContent).not.toContain('par ')
	})
})
