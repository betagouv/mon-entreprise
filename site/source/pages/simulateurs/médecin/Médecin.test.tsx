import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TestProvider } from '@/test/TestProvider'

import { Médecin } from './Médecin'

describe('Simulateur médecin', () => {
	it("affiche l'avertissement spécifique aux médecins", async () => {
		render(
			<TestProvider>
				<Médecin />
			</TestProvider>
		)

		const avertissements = await screen.findAllByText(
			/à destination des médecins/
		)

		expect(avertissements.length).toBeGreaterThan(0)
	})
})
