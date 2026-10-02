import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { PARAMÈTRE_SITUATION, PARAMÈTRE_UNITÉ } from '@/domaine/parametresUrl'
import { TestProvider } from '@/test/TestProvider'
import { encodeSituationSérialisée } from '@/utils/URLs'

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
	beforeEach(() => {
		window.history.replaceState({}, '', '/')
	})

	describe('période de calcul', () => {
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

	describe('synchronisation avec l’URL', () => {
		describe('simulateur => URL', () => {
			it('enregistre la situation dans l’URL', async () => {
				const { user } = monterComparateurDeStatuts()

				await user.type(screen.getByLabelText(/chiffre d'affaires/i), '48000')
				await user.click(screen.getByLabelText(/Libérale/i))

				await waitFor(() => {
					const params = new URLSearchParams(window.location.search)

					expect(params.get(PARAMÈTRE_SITUATION)).toBe(
						encodeSituationSérialisée({
							chiffreDAffaires: 48000,
							natureActivité: 'libérale',
						})
					)
				})
			})

			it('enregistre l’unité dans l’URL', async () => {
				const { user } = monterComparateurDeStatuts()

				await user.type(screen.getByLabelText(/chiffre d'affaires/i), '48000')
				await user.click(screen.getByLabelText(/Montant mensuel/i))

				await waitFor(() => {
					const params = new URLSearchParams(window.location.search)

					expect(params.get(PARAMÈTRE_UNITÉ)).toBe('€/mois')
				})
			})

			it('préserve les paramètres iframe lors de la synchronisation de la situation', async () => {
				const params = new URLSearchParams({
					couleur: '#123456',
					integratorUrl: 'https://example.com',
					lang: 'en',
				})

				window.history.replaceState({}, '', `/?${params.toString()}`)

				const { user } = monterComparateurDeStatuts()

				await user.type(screen.getByLabelText(/chiffre d'affaires/i), '48000')

				await waitFor(() => {
					expect(
						new URLSearchParams(window.location.search).has(PARAMÈTRE_SITUATION)
					).toBe(true)
				})

				const newParams = new URLSearchParams(window.location.search)

				expect(newParams.get(PARAMÈTRE_SITUATION)).toBe(
					encodeSituationSérialisée({
						chiffreDAffaires: 48000,
					})
				)
				expect(newParams.has(PARAMÈTRE_UNITÉ)).toBe(true)
				expect(newParams.get(PARAMÈTRE_UNITÉ)).toBe('€/an')

				expect(newParams.get('couleur')).toBe('#123456')
				expect(newParams.get('integratorUrl')).toBe('https://example.com')
				expect(newParams.get('lang')).toBe('en')
			})

			it('préserve les paramètres iframe lors de la réinitialisation de la situation', async () => {
				const params = new URLSearchParams({
					[PARAMÈTRE_SITUATION]: encodeSituationSérialisée({
						chiffreDAffaires: 48000,
					}),
					[PARAMÈTRE_UNITÉ]: '€/mois',
					couleur: '#123456',
					integratorUrl: 'https://example.com',
					lang: 'en',
				})

				window.history.replaceState({}, '', `/?${params.toString()}`)

				const { user } = monterComparateurDeStatuts()

				await user.clear(screen.getByLabelText(/chiffre d'affaires/i))

				await waitFor(() => {
					expect(
						new URLSearchParams(window.location.search).has(PARAMÈTRE_SITUATION)
					).toBe(false)
				})

				const newParams = new URLSearchParams(window.location.search)

				expect(newParams.has(PARAMÈTRE_UNITÉ)).toBe(false)

				expect(newParams.get('couleur')).toBe('#123456')
				expect(newParams.get('integratorUrl')).toBe('https://example.com')
				expect(newParams.get('lang')).toBe('en')
			})
		})

		describe('URL => simulateur', () => {
			it('charge la situation depuis l’URL', () => {
				const params = new URLSearchParams({
					[PARAMÈTRE_SITUATION]: encodeSituationSérialisée({
						chiffreDAffaires: 48000,
						natureActivité: 'libérale',
					}),
				})

				window.history.replaceState({}, '', `/?${params.toString()}`)
				monterComparateurDeStatuts()

				const champCA = screen.getByLabelText(/chiffre d'affaires/i)

				expect((champCA as HTMLInputElement).value).toMatch(/^48\s000\s€$/)
				expect(screen.getByLabelText(/Libérale/i)).toBeChecked()
			})

			it('charge l’unité depuis l’URL', () => {
				const params = new URLSearchParams({
					[PARAMÈTRE_SITUATION]: encodeSituationSérialisée({
						chiffreDAffaires: 48000,
					}),
					[PARAMÈTRE_UNITÉ]: '€/mois',
				})

				window.history.replaceState({}, '', `/?${params.toString()}`)
				monterComparateurDeStatuts()

				const champCA = screen.getByLabelText(/chiffre d'affaires/i)

				expect(screen.getByLabelText(/Montant mensuel/i)).toBeChecked()
				expect((champCA as HTMLInputElement).value).toMatch(/^4\s000\s€$/)
			})
		})
	})
})
