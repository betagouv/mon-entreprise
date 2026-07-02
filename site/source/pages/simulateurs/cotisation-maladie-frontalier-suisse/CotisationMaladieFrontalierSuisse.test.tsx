import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { testerEn } from '@/test/testerEn'
import { TestProvider } from '@/test/TestProvider'

import CotisationMaladieFrontalierSuisse from './CotisationMaladieFrontalierSuisse'

const saisirDateAffiliation = async (
	user: ReturnType<typeof userEvent.setup>,
	dateAffiliation: string
) => {
	const question = await screen.findByRole('group', {
		name: /affiliation a-t-elle débuté/i,
	})
	await user.type(within(question).getByRole('textbox'), dateAffiliation)
}

const saisirSituationComplète = async (
	user: ReturnType<typeof userEvent.setup>,
	dateAffiliation = '15/01/2026'
) => {
	await saisirDateAffiliation(user, dateAffiliation)
	await user.type(screen.getByLabelText(/Salaires perçus en/i), '50000')
}

describe('Simulateur cotisation maladie frontalier suisse', () => {
	beforeEach(() => testerEn(2026))

	it('affiche les trois champs de saisie au montage', async () => {
		render(
			<TestProvider>
				<CotisationMaladieFrontalierSuisse />
			</TestProvider>
		)

		expect(
			await screen.findByRole('group', {
				name: /affiliation a-t-elle débuté/i,
			})
		).toBeInTheDocument()
		expect(screen.getByText(/Salaires perçus en/i)).toBeInTheDocument()
		expect(screen.getByText(/Autres revenus perçus en/i)).toBeInTheDocument()
	})

	it("n'affiche pas la cotisation tant que la saisie est incomplète", async () => {
		render(
			<TestProvider>
				<CotisationMaladieFrontalierSuisse />
			</TestProvider>
		)

		await screen.findByRole('group', {
			name: /affiliation a-t-elle débuté/i,
		})

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

	it("ne propose de préciser la situation qu'une fois la situation minimale saisie", async () => {
		const user = userEvent.setup()
		render(
			<TestProvider>
				<CotisationMaladieFrontalierSuisse />
			</TestProvider>
		)

		await screen.findByRole('group', {
			name: /affiliation a-t-elle débuté/i,
		})
		expect(
			screen.queryByRole('button', { name: /préciser votre situation/i })
		).not.toBeInTheDocument()

		await saisirDateAffiliation(user, '15/01/2026')
		expect(
			screen.queryByRole('button', { name: /préciser votre situation/i })
		).not.toBeInTheDocument()

		await user.type(screen.getByLabelText(/Salaires perçus en/i), '50000')

		expect(
			await screen.findByRole('button', { name: /préciser votre situation/i })
		).toBeInTheDocument()
	})

	it("ne propose de partager la simulation qu'une fois la situation minimale saisie", async () => {
		const user = userEvent.setup()
		render(
			<TestProvider>
				<CotisationMaladieFrontalierSuisse />
			</TestProvider>
		)

		await screen.findByRole('group', {
			name: /affiliation a-t-elle débuté/i,
		})
		expect(
			screen.queryByRole('button', { name: /lien de partage/i })
		).not.toBeInTheDocument()

		await saisirSituationComplète(user)

		expect(
			await screen.findByRole('button', { name: /lien de partage/i })
		).toBeInTheDocument()
	})

	it("prend en compte la fin d'affiliation saisie en question", async () => {
		const user = userEvent.setup()
		render(
			<TestProvider>
				<CotisationMaladieFrontalierSuisse />
			</TestProvider>
		)

		await saisirSituationComplète(user, '01/01/2026')

		await screen.findByText(/Cotisation maladie annuelle/i)
		expect(screen.queryByText(/au prorata/i)).not.toBeInTheDocument()

		await user.click(
			screen.getByRole('button', { name: /préciser votre situation/i })
		)
		await user.click(
			await screen.findByRole('button', { name: /modifier fin d.affiliation/i })
		)
		const questionFin = await screen.findByRole('group', {
			name: /votre affiliation prend-elle fin/i,
		})
		await user.type(within(questionFin).getByRole('textbox'), '30/09/2026')

		expect(await screen.findByText(/au prorata/i)).toBeInTheDocument()
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
