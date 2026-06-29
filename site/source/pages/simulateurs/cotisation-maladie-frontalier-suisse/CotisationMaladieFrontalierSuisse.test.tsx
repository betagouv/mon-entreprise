import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

	it('affiche la cotisation une fois la saisie complète', async () => {
		const user = userEvent.setup()
		render(
			<TestProvider>
				<CotisationMaladieFrontalierSuisse />
			</TestProvider>
		)

		await user.type(
			await screen.findByLabelText(/Date d'affiliation/i),
			'15/01/2026'
		)
		await user.type(screen.getByLabelText(/Salaires perçus en/i), '50000')

		expect(
			await screen.findByText(/Cotisation maladie annuelle/i)
		).toBeInTheDocument()
	})
})
