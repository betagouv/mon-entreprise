import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import PeriodSwitch from './PeriodSwitch'
import simulateursReducer from '@/store/slices/simulateursSlice'

describe('PeriodSwitch', () => {
	const createStore = () =>
		configureStore({
			reducer: {
				simulators: simulateursReducer,
			},
		})

	it('affiche les périodes par défaut (mensuel et annuel)', () => {
		const store = createStore()

		render(
			<Provider store={store}>
				<PeriodSwitch />
			</Provider>
		)

		expect(screen.getByText('Montant mensuel')).toBeInTheDocument()
		expect(screen.getByText('Montant annuel')).toBeInTheDocument()
	})

	it('affiche les périodes personnalisées (mensuel, trimestriel, annuel)', () => {
		const store = createStore()

		render(
			<Provider store={store}>
				<PeriodSwitch
					periods={[
						{ label: 'Montant mensuel', unit: '€/mois' },
						{ label: 'Montant trimestriel', unit: '€/trimestre' },
						{ label: 'Montant annuel', unit: '€/an' },
					]}
				/>
			</Provider>
		)

		expect(screen.getByText('Montant mensuel')).toBeInTheDocument()
		expect(screen.getByText('Montant trimestriel')).toBeInTheDocument()
		expect(screen.getByText('Montant annuel')).toBeInTheDocument()
	})

	it('permet de sélectionner la période trimestrielle', async () => {
		const store = createStore()
		const user = userEvent.setup()

		render(
			<Provider store={store}>
				<PeriodSwitch
					periods={[
						{ label: 'Montant mensuel', unit: '€/mois' },
						{ label: 'Montant trimestriel', unit: '€/trimestre' },
						{ label: 'Montant annuel', unit: '€/an' },
					]}
				/>
			</Provider>
		)

		const trimestrielRadio = screen.getByDisplayValue('€/trimestre')
		await user.click(trimestrielRadio)

		expect(trimestrielRadio).toBeChecked()
	})

	it('fonctionne avec seulement mensuel et annuel (pas de régression)', () => {
		const store = createStore()

		render(
			<Provider store={store}>
				<PeriodSwitch
					periods={[
						{ label: 'Montant mensuel', unit: '€/mois' },
						{ label: 'Montant annuel', unit: '€/an' },
					]}
				/>
			</Provider>
		)

		expect(screen.getByText('Montant mensuel')).toBeInTheDocument()
		expect(screen.getByText('Montant annuel')).toBeInTheDocument()
		expect(screen.queryByText('Montant trimestriel')).not.toBeInTheDocument()
	})

	it('a un label aria-label accessible', () => {
		const store = createStore()

		render(
			<Provider store={store}>
				<PeriodSwitch />
			</Provider>
		)

		expect(screen.getByLabelText('Période de calcul')).toBeInTheDocument()
	})
})
