import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { TestProvider } from '@/test/TestProvider'

import { ComparateurDeStatuts } from './ComparateurDeStatuts'

const monterComparateurDeStatuts = () => {
	const user = userEvent.setup()
	render(
		<TestProvider>
			<ComparateurDeStatuts />
		</TestProvider>
	)

	return { user }
}

describe('ComparateurDeStatuts', () => {
	it('sélectionne des €/an par défaut', () => {
		monterComparateurDeStatuts()

		expect(screen.getByLabelText(/Montant annuel/i)).toBeChecked()
	})

	it('convertit correctement des €/mois en €/an', async () => {
		const { user } = monterComparateurDeStatuts()

		await user.click(screen.getByLabelText(/Montant mensuel/i))
		const champCA = screen.getByLabelText(/chiffre d'affaires/i)
		await user.type(champCA, '4000')
		await user.click(screen.getByLabelText(/Montant annuel/i))

		expect((champCA as HTMLInputElement).value).toMatch(/^48\s000\s€$/)
	})

	it('convertit correctement des €/an en €/mois', async () => {
		const { user } = monterComparateurDeStatuts()

		const champCA = screen.getByLabelText(/chiffre d'affaires/i)
		await user.type(champCA, '50000')
		await user.click(screen.getByLabelText(/Montant mensuel/i))

		expect((champCA as HTMLInputElement).value).toMatch(/^4\s167\s€$/)
	})

	it('affiche la valeur en €/an initiale après une conversion en €/mois et un retour aux €/an', async () => {
		const { user } = monterComparateurDeStatuts()

		const champCA = screen.getByLabelText(/chiffre d'affaires/i)
		await user.type(champCA, '50000')
		await user.click(screen.getByLabelText(/Montant mensuel/i))
		await user.click(screen.getByLabelText(/Montant annuel/i))

		expect((champCA as HTMLInputElement).value).toMatch(/^50\s000\s€$/)
	})
})
