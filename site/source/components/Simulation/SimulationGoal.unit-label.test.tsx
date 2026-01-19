import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import SimulationGoal from '@/components/Simulation/SimulationGoal'
import simulateursReducer from '@/store/slices/simulateursSlice'

/**
 * Test d'intégration : vérifier que le libellé d'unité affichée dans l'input
 * du champ "Chiffre d'affaires" change avec la période sélectionnée
 * (mensuel → "par mois", trimestriel → "par trimestre", annuel → "par an")
 */
describe('MontantField - Unit Label Display per Period', () => {
	const createStore = () =>
		configureStore({
			reducer: {
				simulators: simulateursReducer,
			},
		})

	it('affiche "par mois" en période mensuelle', () => {
		const store = createStore()

		// Initialiser le state avec la période mensuelle
		store.dispatch({
			type: 'simulators/setTargetUnit',
			payload: '€/mois',
		})

		render(
			<Provider store={store}>
				<SimulationGoal
					dottedName="entreprise . chiffre d'affaires"
					label="Chiffre d'affaires"
					editable={true}
				/>
			</Provider>
		)

		// Rechercher le texte "par mois" dans le DOM
		expect(screen.getByText(/par mois/i)).toBeInTheDocument()
	})

	it('affiche "par trimestre" en période trimestrielle', () => {
		const store = createStore()

		// Initialiser le state avec la période trimestrielle
		store.dispatch({
			type: 'simulators/setTargetUnit',
			payload: '€/trimestre',
		})

		render(
			<Provider store={store}>
				<SimulationGoal
					dottedName="entreprise . chiffre d'affaires"
					label="Chiffre d'affaires"
					editable={true}
				/>
			</Provider>
		)

		// Rechercher le texte "par trimestre" dans le DOM
		expect(screen.getByText(/par trimestre/i)).toBeInTheDocument()
	})

	it('affiche "par an" en période annuelle', () => {
		const store = createStore()

		// Initialiser le state avec la période annuelle
		store.dispatch({
			type: 'simulators/setTargetUnit',
			payload: '€/an',
		})

		render(
			<Provider store={store}>
				<SimulationGoal
					dottedName="entreprise . chiffre d'affaires"
					label="Chiffre d'affaires"
					editable={true}
				/>
			</Provider>
		)

		// Rechercher le texte "par an" dans le DOM
		expect(screen.getByText(/par an/i)).toBeInTheDocument()
	})
})
