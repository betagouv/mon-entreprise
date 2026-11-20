import { render, screen } from '@testing-library/react'
import { Option } from 'effect'
import { describe, expect, it } from 'vitest'

import { eurosParMois } from '@/domaine/MontantRecurrent'
import { TestProvider } from '@/test/TestProvider'

import { ObjectifSaisissableDeSimulation } from './ObjectifSaisissableDeSimulation'

describe('ObjectifSaisissableDeSimulation', () => {
	it('affiche ses mentions sous le champ de saisie', () => {
		render(
			<TestProvider>
				<ObjectifSaisissableDeSimulation
					id="objectif"
					titre="Coût total employeur"
					valeur={Option.some(eurosParMois(1988))}
					rendreChampSaisie={({ id }) => <input id={id} aria-label="champ" />}
					mentions={<p>Dont dispositif RGDU : − 700 €</p>}
				/>
			</TestProvider>
		)

		const champ = screen.getByRole('textbox', { name: 'champ' })
		const mention = screen.getByText('Dont dispositif RGDU : − 700 €')

		expect(
			champ.compareDocumentPosition(mention) & Node.DOCUMENT_POSITION_FOLLOWING
		).toBeTruthy()
	})
})
