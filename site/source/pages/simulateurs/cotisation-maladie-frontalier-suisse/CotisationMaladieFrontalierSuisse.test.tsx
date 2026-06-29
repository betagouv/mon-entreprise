import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { TestProvider } from '@/test/TestProvider'

import CotisationMaladieFrontalierSuisse from './CotisationMaladieFrontalierSuisse'

const saisirSituationComplète = async (
	user: ReturnType<typeof userEvent.setup>,
	dateAffiliation = '15/01/2026'
) => {
	await user.type(
		await screen.findByLabelText(/Date d'affiliation/i),
		dateAffiliation
	)
	await user.type(screen.getByLabelText(/Salaires perçus en/i), '50000')
}

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

		await saisirSituationComplète(user)

		expect(
			await screen.findByText(/Cotisation maladie annuelle/i)
		).toBeInTheDocument()
	})

	it("affiche la note d'estimation applicable deux ans plus tard", async () => {
		const user = userEvent.setup()
		render(
			<TestProvider>
				<CotisationMaladieFrontalierSuisse />
			</TestProvider>
		)

		await saisirSituationComplète(user)

		expect(
			await screen.findByText(/applicable à votre cotisation 2028/i)
		).toBeInTheDocument()
	})

	it("avertit quand l'affiliation est dans le futur", async () => {
		const user = userEvent.setup()
		render(
			<TestProvider>
				<CotisationMaladieFrontalierSuisse />
			</TestProvider>
		)

		await saisirSituationComplète(user, '15/01/2030')

		expect(
			await screen.findByText(/cette estimation suppose que le taux/i)
		).toBeInTheDocument()
	})

	it("n'avertit pas quand l'affiliation est dans l'année courante", async () => {
		const user = userEvent.setup()
		render(
			<TestProvider>
				<CotisationMaladieFrontalierSuisse />
			</TestProvider>
		)

		await saisirSituationComplète(user)
		await screen.findByText(/Cotisation maladie annuelle/i)

		expect(
			screen.queryByText(/cette estimation suppose que le taux/i)
		).not.toBeInTheDocument()
	})
})
