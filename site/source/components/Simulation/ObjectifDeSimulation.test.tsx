import { render, screen } from '@testing-library/react'
import { Option } from 'effect'
import { describe, expect, it } from 'vitest'

import { eurosParAn } from '@/domaine/Montant'
import { TestProvider } from '@/test/TestProvider'

import { ObjectifDeSimulation } from './ObjectifDeSimulation'

const monterObjectif = () => {
	render(
		<TestProvider>
			<ObjectifDeSimulation
				id="objectif"
				titre="Cotisation maladie annuelle"
				sousTitre="Estimation d’après vos revenus 2026"
				valeur={Option.some(eurosParAn(1800))}
				small
			/>
		</TestProvider>
	)

	return screen.getByText(/1\s*800\s*€\/an/)
}

describe('ObjectifDeSimulation', () => {
	it('nomme la valeur par le titre seul (le sous-titre ne pollue pas le label)', () => {
		const valeur = monterObjectif()

		expect(valeur).toHaveAccessibleName('Cotisation maladie annuelle')
	})

	it('associe le sous-titre à la valeur en description accessible', () => {
		const valeur = monterObjectif()

		expect(valeur).toHaveAccessibleDescription(
			'Estimation d’après vos revenus 2026'
		)
	})
})
