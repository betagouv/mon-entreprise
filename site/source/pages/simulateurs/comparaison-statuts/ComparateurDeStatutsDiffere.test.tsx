import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TestProvider } from '@/test/TestProvider'

import { ComparateurDeStatutsDifféré } from './ComparateurDeStatutsDiffere'

describe('ComparateurDeStatutsDifféré', () => {
	it('affiche le comparateur une fois son code chargé', async () => {
		render(
			<TestProvider>
				<ComparateurDeStatutsDifféré />
			</TestProvider>
		)

		expect(
			await screen.findByLabelText(
				/chiffre d'affaires/i,
				{},
				{ timeout: 30000 }
			)
		).toBeInTheDocument()
	}, 60000)
})
