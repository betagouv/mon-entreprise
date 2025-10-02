import { waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
	getAvertissementDépassementPlafond,
	getMessageAffiliation,
	getMontantCotisations,
	getTexteRégime,
	render,
	saisirRecettes,
	sélectionnerRégime,
} from './test/helpers/locationDeMeubléHelpers'

describe('Location de meublé', () => {
	describe('Logement meublé de courte durée', () => {
		describe('Recettes < 23 000€', () => {
			it.skip("doit afficher un message indiquant qu'il n'y a pas d'affiliation obligatoire", async () => {
				render()
				await saisirRecettes(15000)

				await waitFor(() => {
					expect(getMessageAffiliation()).toBeInTheDocument()
				})
				expect(getMontantCotisations()).toBeNull()
			})

			it.skip('doit afficher le message pour des recettes juste en dessous du seuil', async () => {
				render()
				await saisirRecettes(22999)

				await waitFor(() => {
					expect(getMessageAffiliation()).toBeInTheDocument()
				})
				expect(getMontantCotisations()).toBeNull()
			})
		})

		describe('Recettes entre 23 000€ et 77 700€', () => {
			it('doit permettre de choisir entre RG, AE ou TI', async () => {
				render()
				await saisirRecettes(50000)

				await waitFor(() => {
					expect(getTexteRégime('RG')).toBeInTheDocument()
				})
				expect(getTexteRégime('AE')).toBeInTheDocument()
				expect(getTexteRégime('TI')).toBeInTheDocument()
			})

			it('doit afficher les cotisations après sélection du régime général', async () => {
				render()
				await saisirRecettes(50000)

				await waitFor(() => expect(getTexteRégime('RG')).toBeInTheDocument())

				sélectionnerRégime('RG')

				await waitFor(() => {
					const montantCotisations = getMontantCotisations()
					expect(montantCotisations).toBeGreaterThan(0)
				})
			})

			it('doit afficher les cotisations après sélection auto-entrepreneur', async () => {
				render()

				await saisirRecettes(50000)
				await waitFor(() => expect(getTexteRégime('AE')).toBeInTheDocument())

				sélectionnerRégime('AE')

				await waitFor(() => {
					const montantCotisations = getMontantCotisations()
					expect(montantCotisations).toBeGreaterThan(0)
				})
			})

			it('doit afficher les cotisations après sélection travailleur indépendant', async () => {
				render()
				await saisirRecettes(50000)
				await waitFor(() => expect(getTexteRégime('TI')).toBeInTheDocument())
				sélectionnerRégime('TI')

				await waitFor(() => {
					const montantCotisations = getMontantCotisations()
					expect(montantCotisations).toBeGreaterThan(0)
				})
			})
		})

		describe('Recettes > 77 700€', () => {
			it('doit permettre uniquement AE et TI', async () => {
				render()
				await saisirRecettes(100000)

				await waitFor(() => {
					expect(getTexteRégime('AE')).toBeInTheDocument()
				})
				await waitFor(() => {
					expect(getTexteRégime('TI')).toBeInTheDocument()
				})

				// Attendre un peu pour s'assurer que l'UI est stabilisée
				await waitFor(() => {
					// Vérifier que RG n'est pas disponible
					expect(getTexteRégime('RG')).toBeNull()
				})
			})

			it('doit afficher un avertissement si RG était préalablement sélectionné', async () => {
				render()
				await saisirRecettes(50000)

				await waitFor(() => expect(getTexteRégime('RG')).toBeInTheDocument())

				sélectionnerRégime('RG')
				await saisirRecettes(80000)

				await waitFor(() => {
					expect(getAvertissementDépassementPlafond()).toBeInTheDocument()
				})
			})
		})
	})
})
