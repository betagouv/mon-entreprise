import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { render, saisirRecettes } from './test/helpers/locationDeMeubléHelpers'

describe('Location de meublé', () => {
	describe('Sélection du type de location', () => {
		it('doit permettre de choisir le type de location', async () => {
			render()

			await waitFor(() => {
				expect(screen.getByText(/Meublé de tourisme/i)).toBeInTheDocument()
			})
			expect(screen.getByText(/Chambre d'hôtes/i)).toBeInTheDocument()
		})
	})

	describe('Logement meublé de courte durée', () => {
		describe('Recettes < 23 000€ (affiliation non obligatoire)', () => {
			it("doit afficher un message indiquant qu'il n'y a pas d'affiliation obligatoire", async () => {
				render()
				await saisirRecettes(15000)

				await waitFor(() => {
					expect(
						screen.getByText(
							/votre activité est considérée comme non-professionnelle/i
						)
					).toBeInTheDocument()
				})
			})

			it('ne doit PAS afficher le comparateur de régimes', async () => {
				render()
				await saisirRecettes(15000)

				await waitFor(() => {
					expect(
						screen.getByText(
							/votre activité est considérée comme non-professionnelle/i
						)
					).toBeInTheDocument()
				})

				expect(screen.queryByText(/Régime général/i)).not.toBeInTheDocument()
				expect(screen.queryByText(/Auto-entrepreneur/i)).not.toBeInTheDocument()
				expect(
					screen.queryByText(/Travailleur indépendant/i)
				).not.toBeInTheDocument()
				expect(screen.queryByText(/Pas d'affiliation/i)).not.toBeInTheDocument()
			})

			it('doit afficher un lien vers la page URSSAF', async () => {
				render()
				await saisirRecettes(15000)

				const lienUrssaf = await waitFor(() => {
					return screen.getByRole('link', {
						name: /en savoir plus sur les régimes d'économie collaborative/i,
					})
				})
				expect(lienUrssaf).toBeInTheDocument()
				expect(lienUrssaf).toHaveAttribute(
					'href',
					expect.stringContaining('urssaf.fr')
				)
			})
		})

		describe('Recettes ≥ 23 000€ (affiliation obligatoire)', () => {
			it("doit afficher un message indiquant que l'affiliation est obligatoire", async () => {
				render()
				await saisirRecettes(25000)

				await waitFor(() => {
					expect(
						screen.getByText(
							/votre activité est considérée comme professionnelle/i
						)
					).toBeInTheDocument()
				})
			})

			it('doit afficher le comparateur avec seulement 3 régimes (sans "Pas d\'affiliation")', async () => {
				render()
				await saisirRecettes(25000)

				const comparateur = await waitFor(() => {
					return screen.getByRole('list', {
						name: /comparaison des régimes/i,
					})
				})

				expect(
					within(comparateur).getByText(/Régime général/i)
				).toBeInTheDocument()
				expect(
					within(comparateur).getByText(/Auto-entrepreneur/i)
				).toBeInTheDocument()
				expect(
					within(comparateur).getByText(/Travailleur indépendant/i)
				).toBeInTheDocument()

				expect(
					within(comparateur).queryByText(/Pas d'affiliation/i)
				).not.toBeInTheDocument()
			})

			it("doit afficher le message d'affiliation obligatoire même juste au seuil (23 000€)", async () => {
				render()
				await saisirRecettes(23000)

				await waitFor(() => {
					expect(
						screen.getByText(
							/votre activité est considérée comme professionnelle/i
						)
					).toBeInTheDocument()
				})

				const comparateur = screen.getByRole('list', {
					name: /comparaison des régimes/i,
				})
				expect(
					within(comparateur).getByText(/Régime général/i)
				).toBeInTheDocument()
			})
		})
	})

	describe('Location mixte (courte et longue durée)', () => {
		it('doit demander la part des recettes de courte durée', async () => {
			render()

			await saisirRecettes(50000)

			await waitFor(() => {
				expect(
					screen.getByText(
						/Proposez-vous de la location courte ou longue durée ?/i
					)
				).toBeInTheDocument()
			})

			const boutonMixte = screen.getByText(/Mixte \(courte et longue durée\)/i)
			fireEvent.click(boutonMixte)

			const boutonSuivant = await screen.findByText(/Suivant/i)
			fireEvent.click(boutonSuivant)

			await waitFor(() => {
				expect(
					screen.getByText(
						/Quelle part des recettes provient de la location courte durée ?/i
					)
				).toBeInTheDocument()
			})
		})
	})
})
