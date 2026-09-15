import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { describe, expect, it } from 'vitest'

import { TestProvider } from '@/test/TestProvider'

import { MontantField } from './MontantField'

const monterChampMontant = (
	props: Partial<ComponentProps<typeof MontantField>> = {}
) => {
	const user = userEvent.setup()
	render(
		<TestProvider>
			<MontantField
				unité="€/titre-restaurant"
				value={undefined}
				label="Valeur du titre"
				{...props}
			/>
		</TestProvider>
	)

	return { user, champ: screen.getByRole<HTMLInputElement>('textbox') }
}

describe('MontantField', () => {
	it('garde les centimes quand on les accepte', async () => {
		const { user, champ } = monterChampMontant({ avecCentimes: true })

		await user.type(champ, '10,50')

		expect(champ.value).toContain('10,5')
	})
})
