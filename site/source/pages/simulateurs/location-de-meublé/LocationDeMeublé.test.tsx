import { screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
	render,
	saisirAutresRevenus,
	saisirRecettes,
	sélectionnerChambreDHôtes,
} from './test/helpers/locationDeMeubléHelpers'

describe('Location de meublé', () => {
	describe('Sélection du type de location', () => {
		it('doit permettre de choisir le type de location', async () => {
			render()

			await waitFor(() => {
				expect(screen.getByText(/Meublé de tourisme/i)).toBeInTheDocument()
			})
			expect(screen.getByText(/Chambre d'hôtes/i)).toBeInTheDocument()
		})

		it("doit afficher un message indiquant que le cas chambre d'hôtes n'est pas encore pris en charge", async () => {
			const { user } = render()

			await sélectionnerChambreDHôtes(user)

			await waitFor(() => {
				expect(
					screen.getByText(/pas encore pris en charge/i)
				).toBeInTheDocument()
			})
		})
	})

	describe('Logement meublé de courte durée', () => {
		describe('Recettes < 23 000€ (affiliation non obligatoire)', () => {
			it("doit afficher un message indiquant qu'il n'y a pas d'affiliation obligatoire", async () => {
				const { user } = render()
				await saisirRecettes(user, 15000)

				await waitFor(() => {
					expect(
						screen.getByText(/pas d'affiliation obligatoire/i)
					).toBeInTheDocument()
				})
			})

			it('ne doit PAS afficher le comparateur de régimes', async () => {
				const { user } = render()
				await saisirRecettes(user, 15000)

				await waitFor(() => {
					expect(
						screen.getByText(/pas d'affiliation obligatoire/i)
					).toBeInTheDocument()
				})

				expect(screen.queryByText(/Régime général/i)).not.toBeInTheDocument()
				expect(screen.queryByText(/Auto-entrepreneur/i)).not.toBeInTheDocument()
				expect(
					screen.queryByText(/Travailleur indépendant/i)
				).not.toBeInTheDocument()
			})

			it('doit afficher un lien vers la page URSSAF', async () => {
				const { user } = render()
				await saisirRecettes(user, 15000)

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

		describe('Recettes ≥ 23 000€ (affiliation potentiellement obligatoire)', () => {
			it("doit afficher que l'affiliation dépend d'autres questions quand seules les recettes sont renseignées", async () => {
				const { user } = render()
				await saisirRecettes(user, 25000)

				const listeInfosManquantes = await screen.findByTestId(
					'liste-informations-manquantes'
				)

				expect(
					within(listeInfosManquantes).getByText(/montant des autres revenus/i)
				).toBeInTheDocument()
			})

			it("doit afficher 'affiliation obligatoire' quand toutes les conditions sont remplies (activité principale, courte durée)", async () => {
				const { user } = render()
				await saisirRecettes(user, 50000)
				await saisirAutresRevenus(user, 30000)

				await waitFor(() => {
					expect(
						screen.getByText(
							/Proposez-vous de la location courte ou longue durée ?/i
						)
					).toBeInTheDocument()
				})

				const boutonCourteDurée = screen.getByText(
					/Location courte durée uniquement/i
				)
				await user.click(boutonCourteDurée)

				const boutonSuivant = await screen.findByText(/Suivant/i)
				await user.click(boutonSuivant)

				await waitFor(() => {
					expect(
						screen.getByText(/affiliation obligatoire/i)
					).toBeInTheDocument()
				})
			})
		})
	})

	describe('Location longue durée exclusivement', () => {
		describe('Recettes >= 23000€ mais < autres revenus (activité secondaire)', () => {
			it("doit afficher 'pas d'affiliation' car aucun régime n'est applicable", async () => {
				const { user } = render()

				await saisirRecettes(user, 25000)
				await saisirAutresRevenus(user, 50000)

				await waitFor(() => {
					expect(
						screen.getByText(
							/Proposez-vous de la location courte ou longue durée ?/i
						)
					).toBeInTheDocument()
				})

				const boutonLongueDurée = screen.getByText(
					/Location longue durée uniquement/i
				)
				await user.click(boutonLongueDurée)

				const boutonSuivant = await screen.findByText(/Suivant/i)
				await user.click(boutonSuivant)

				await waitFor(() => {
					expect(
						screen.getByText(/pas d'affiliation obligatoire/i)
					).toBeInTheDocument()
				})
			})
		})
	})

	describe('Location mixte (courte et longue durée)', () => {
		describe('Activité secondaire (recettes < autres revenus)', () => {
			it('doit afficher "sous conditions : recettes de courte durée" pour RG et TI quand cette info manque', async () => {
				const { user } = render()

				await saisirRecettes(user, 25000)
				await saisirAutresRevenus(user, 50000)

				await waitFor(() => {
					expect(
						screen.getByText(
							/Proposez-vous de la location courte ou longue durée ?/i
						)
					).toBeInTheDocument()
				})

				const boutonMixte = screen.getByText(
					/Mixte \(courte et longue durée\)/i
				)
				await user.click(boutonMixte)

				const boutonSuivant = await screen.findByText(/Suivant/i)
				await user.click(boutonSuivant)

				const comparateur = await screen.findByTestId('comparateur-régimes')

				expect(
					within(comparateur).getAllByText(/recettes de courte durée/i).length
				).toBeGreaterThan(0)
			})

			it('doit demander la part des recettes de courte durée', async () => {
				const { user } = render()

				await saisirRecettes(user, 50000)
				await saisirAutresRevenus(user, 100000)

				await waitFor(() => {
					expect(
						screen.getByText(
							/Proposez-vous de la location courte ou longue durée ?/i
						)
					).toBeInTheDocument()
				})

				const boutonMixte = screen.getByText(
					/Mixte \(courte et longue durée\)/i
				)
				await user.click(boutonMixte)

				const boutonSuivant = await screen.findByText(/Suivant/i)
				await user.click(boutonSuivant)

				await waitFor(() => {
					expect(
						screen.getByText(
							/Quelle part des recettes provient de la location courte durée ?/i
						)
					).toBeInTheDocument()
				})
			})
		})

		describe('Activité principale (recettes >= autres revenus)', () => {
			it('ne doit PAS demander la part des recettes de courte durée', async () => {
				const { user } = render()

				await saisirRecettes(user, 50000)
				await saisirAutresRevenus(user, 30000)

				await waitFor(() => {
					expect(
						screen.getByText(
							/Proposez-vous de la location courte ou longue durée ?/i
						)
					).toBeInTheDocument()
				})

				const boutonMixte = screen.getByText(
					/Mixte \(courte et longue durée\)/i
				)
				await user.click(boutonMixte)

				let boutonSuivant: HTMLElement | null =
					await screen.findByText(/Suivant/i)

				while (boutonSuivant) {
					expect(
						screen.queryByText(
							/Quelle part des recettes provient de la location courte durée ?/i
						)
					).not.toBeInTheDocument()

					await user.click(boutonSuivant)

					const boutonClassé = screen.queryByText(/^Classé$/i)
					if (boutonClassé) {
						await user.click(boutonClassé)
					}

					try {
						boutonSuivant = await screen.findByText(/Suivant/i)
					} catch {
						boutonSuivant = null
					}
				}

				expect(
					screen.queryByText(
						/Quelle part des recettes provient de la location courte durée ?/i
					)
				).not.toBeInTheDocument()
			})
		})
	})
})
