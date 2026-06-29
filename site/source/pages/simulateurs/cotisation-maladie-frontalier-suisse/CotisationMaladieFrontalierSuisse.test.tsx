import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TestProvider } from '@/test/TestProvider'

import CotisationMaladieFrontalierSuisse from './CotisationMaladieFrontalierSuisse'

describe('Simulateur cotisation maladie frontalier suisse', () => {
	it('affiche les trois champs de saisie au montage', async () => {
		render(
			<TestProvider>
				<CotisationMaladieFrontalierSuisse />
			</TestProvider>
		)

		expect(await screen.findByText(/Date d'affiliation/i)).toBeInTheDocument()
		expect(screen.getByText(/Salaires perçus en/i)).toBeInTheDocument()
		expect(screen.getByText(/Autres revenus perçus en/i)).toBeInTheDocument()
	})

	it("n'affiche pas la cotisation tant que la saisie est incomplète", async () => {
		render(
			<TestProvider>
				<CotisationMaladieFrontalierSuisse />
			</TestProvider>
		)

		await screen.findByText(/Date d'affiliation/i)

		expect(
			screen.queryByText(/Cotisation maladie annuelle/i)
		).not.toBeInTheDocument()
	})
})
