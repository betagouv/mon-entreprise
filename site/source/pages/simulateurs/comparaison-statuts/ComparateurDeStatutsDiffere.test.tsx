import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TestProvider } from '@/test/TestProvider'

import { ComparateurDeStatutsDifféré } from './ComparateurDeStatutsDiffere'
// Charge le module de la page avec le fichier de test : sa transformation par
// Vite prend plusieurs secondes et ne fait pas partie du comportement testé.
// Le premier rendu passe quand même par le `Suspense` de `lazy`.
import './ComparateurDeStatuts'

describe('ComparateurDeStatutsDifféré', () => {
	it('affiche le comparateur une fois son code chargé', async () => {
		render(
			<TestProvider>
				<ComparateurDeStatutsDifféré />
			</TestProvider>
		)

		expect(
			screen.getByRole('img', { name: 'Chargement en cours' })
		).toBeInTheDocument()
		// Le premier rendu du comparateur prend près d'une seconde en local, soit
		// le délai par défaut de `findBy*` : on l'allonge en restant sous le délai
		// par défaut du test (5 s).
		expect(
			await screen.findByLabelText(/chiffre d'affaires/i, {}, { timeout: 4000 })
		).toBeInTheDocument()
	})
})
