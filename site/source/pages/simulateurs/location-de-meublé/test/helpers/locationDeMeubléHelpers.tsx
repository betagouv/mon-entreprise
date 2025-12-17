import {
	fireEvent,
	render as rtlRender,
	screen,
	waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

import LocationDeMeubléWithProvider from '../../LocationDeMeublé'
import { TestProvider } from './TestProvider'

// Délai pour attendre que le debounce de useSelection (300ms) se déclenche
const DEBOUNCE_DELAY = 350

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const render = () => {
	const user = userEvent.setup()

	return {
		user,
		...rtlRender(
			<TestProvider>
				<LocationDeMeubléWithProvider />
			</TestProvider>
		),
	}
}

export const saisirRecettes = async (
	user: ReturnType<typeof userEvent.setup>,
	montant: number
) => {
	const allInputs = screen.getAllByRole('textbox')
	const champRecettes = allInputs[0] as HTMLInputElement

	await user.clear(champRecettes)
	await user.type(champRecettes, montant.toString())

	await waitFor(() => {
		const montantSaisi = parseMontant(champRecettes.value)
		expect(montantSaisi).toBe(montant)
	})
}

export const sélectionnerRégime = (régime: 'RG' | 'AE' | 'TI') => {
	const labels = {
		RG: /Régime général \(cotisations URSSAF\)/i,
		AE: /Micro-entreprise/i,
		TI: /Travailleur indépendant/i,
	}
	const boutonRégime = screen.getByText(labels[régime])
	fireEvent.click(boutonRégime)
}

export const getMessageAffiliation = () => {
	return screen.queryByText(
		/votre activité n'est pas considérée comme professionnelle/i
	)
}

export const getTexteRégime = (régime: 'RG' | 'AE' | 'TI') => {
	const labels = {
		RG: /Régime général \(cotisations URSSAF\)/i,
		AE: /Micro-entreprise/i,
		TI: /Travailleur indépendant/i,
	}

	return screen.queryByText(labels[régime])
}

export const getAvertissementDépassementPlafond = () => {
	return screen.queryByText(/Vous dépassez le plafond autorisé/i)
}

const parseMontant = (text: string): number | null => {
	// Supprimer les symboles et espaces, puis les virgules de séparation des milliers
	const cleanText = text.replace(/[€\s]/g, '').replace(/,/g, '')
	const montant = parseFloat(cleanText)

	return isNaN(montant) ? null : montant
}

export const getMontantCotisations = () => {
	const element = document.getElementById(
		'objectif-location-meuble-cotisations-value'
	)
	if (!element?.textContent) return null

	return parseMontant(element.textContent)
}

export const getTexteRevenuNet = () => {
	return screen.queryByText(/Revenu net/i)
}

export const getMontantRevenuNet = () => {
	return screen.queryByTestId('montant-revenu-net')
}

export const saisirAutresRevenus = async (
	user: ReturnType<typeof userEvent.setup>,
	montant: number
) => {
	const champAutresRevenus = await waitFor(() =>
		screen.getByLabelText(/Montant des autres revenus annuels/i)
	)

	await user.clear(champAutresRevenus)
	await user.type(champAutresRevenus, montant.toString())

	await waitFor(() => {
		const montantSaisi = parseMontant(
			(champAutresRevenus as HTMLInputElement).value
		)
		expect(montantSaisi).toBe(montant)
	})

	// Attendre que le debounce de useSelection se déclenche
	await sleep(DEBOUNCE_DELAY)
}
