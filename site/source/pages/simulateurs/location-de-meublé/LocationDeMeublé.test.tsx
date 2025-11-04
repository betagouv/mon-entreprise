import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
	getMessageAffiliation,
	getMontantCotisations,
	render,
	saisirRecettes,
} from './test/helpers/locationDeMeubléHelpers'

describe('Location de meublé', () => {
	describe('Sélection du type de location', () => {
		it('doit permettre de choisir le type de location', async () => {
			render()
			await saisirRecettes(50000)

			await waitFor(() => {
				expect(screen.getByText(/^Logement meublé$/i)).toBeInTheDocument()
			})
			expect(
				screen.getByText(/Logement meublé de tourisme classé/i)
			).toBeInTheDocument()
			expect(screen.getByText(/Chambre d'hôte/i)).toBeInTheDocument()
		})
	})

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
	})
})
