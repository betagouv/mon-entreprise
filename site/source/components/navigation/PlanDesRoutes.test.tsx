import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PlanDesRoutes } from '@/components/navigation/PlanDesRoutes'
import { Ul } from '@/design-system'
import { TestProvider } from '@/test/TestProvider'

const SALAIRE_BRUT_NET = '/simulateurs/salaire-brut-net'

describe('PlanDesRoutes', () => {
	it('lie le libellé français au chemin français', () => {
		render(
			<TestProvider>
				<Ul>
					<PlanDesRoutes
						routeHrefs={{ [SALAIRE_BRUT_NET]: SALAIRE_BRUT_NET }}
					/>
				</Ul>
			</TestProvider>
		)

		expect(
			screen.getByRole('link', { name: 'Simulateur de revenus pour salarié' })
		).toHaveAttribute('href', SALAIRE_BRUT_NET)
	})

	it('lie le libellé anglais au chemin traduit', () => {
		render(
			<TestProvider langue="en">
				<Ul>
					<PlanDesRoutes
						routeHrefs={{ [SALAIRE_BRUT_NET]: '/calculators/salary' }}
					/>
				</Ul>
			</TestProvider>
		)

		expect(
			screen.getByRole('link', { name: 'Income simulator for employees' })
		).toHaveAttribute('href', '/calculators/salary')
	})

	it('n’affiche pas un chemin déclaré que le manifeste ne sert pas', () => {
		render(
			<TestProvider>
				<Ul>
					<PlanDesRoutes routeHrefs={{}} />
				</Ul>
			</TestProvider>
		)

		expect(screen.queryAllByRole('link')).toEqual([])
	})
})
