import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TestProvider } from '@/test/TestProvider'

import { ChoixPériodeDeCalcul } from './ChoixPeriodeDeCalcul'

const monterChoixPériodeDeCalcul = (unité: '€/an' | '€/mois' = '€/an') => {
	render(
		<TestProvider>
			<div data-testid="choix-periode-de-calcul">
				<ChoixPériodeDeCalcul unité={unité} onChange={vi.fn()} />
			</div>
		</TestProvider>
	)

	return { champ: screen.getByTestId('choix-periode-de-calcul') }
}

describe('ChoixPériodeDeCalcul', () => {
	it('affiche une légende et 2 options', () => {
		const { champ } = monterChoixPériodeDeCalcul()

		expect(within(champ).getByText(/Période de calcul/i)).toBeInTheDocument()
		expect(within(champ).getAllByRole('radio')).toHaveLength(2)
		expect(within(champ).getByLabelText(/Montant annuel/i)).toBeInTheDocument()
		expect(within(champ).getByLabelText(/Montant mensuel/i)).toBeInTheDocument()
	})

	it.each([
		['€/an', /Montant annuel/i],
		['€/mois', /Montant mensuel/i],
	])('sélectionne l’unité fournie par défaut (%s)', (unité, libellé) => {
		const { champ } = monterChoixPériodeDeCalcul(unité as '€/an' | '€/mois')

		expect(within(champ).getByLabelText(libellé)).toBeChecked()
	})
})
