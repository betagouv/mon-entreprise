import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { TestProvider } from '@/test/TestProvider'

import { DateField } from './DateField'

const monterChampDate = (onChange = vi.fn()) => {
	const user = userEvent.setup()
	render(
		<TestProvider>
			<DateField onChange={onChange} />
		</TestProvider>
	)

	return { user, champ: screen.getByRole('textbox'), onChange }
}

describe('DateField', () => {
	it('déclenche une valeur vide quand on efface toute la saisie', async () => {
		const { user, champ, onChange } = monterChampDate()

		await user.type(champ, '15/01/2026')
		expect(onChange).toHaveBeenLastCalledWith(expect.any(Date))

		await user.clear(champ)
		expect(onChange).toHaveBeenLastCalledWith()
	})

	it('affiche une erreur quand la saisie est invalide', async () => {
		const { user, champ } = monterChampDate()

		await user.type(champ, 'abc')

		expect(await screen.findByText(/invalide/i)).toBeInTheDocument()
	})

	it("n'affiche pas d'erreur quand le champ est vidé", async () => {
		const { user, champ } = monterChampDate()

		await user.type(champ, '15/01/2026')
		await user.clear(champ)

		expect(screen.queryByText(/invalide/i)).not.toBeInTheDocument()
	})
})
