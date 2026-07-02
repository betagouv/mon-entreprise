import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as O from 'effect/Option'
import { useState } from 'react'
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

	it('refuse une date rejetée par la validation et en affiche la raison', async () => {
		const user = userEvent.setup()
		const onChange = vi.fn()
		render(
			<TestProvider>
				<DateField
					onChange={onChange}
					validation={(date) =>
						date.getFullYear() < 2026
							? O.some('Cette date est trop ancienne')
							: O.none()
					}
				/>
			</TestProvider>
		)

		await user.type(screen.getByRole('textbox'), '15/01/2020')

		expect(onChange).toHaveBeenLastCalledWith()
		expect(
			await screen.findByText('Cette date est trop ancienne')
		).toBeInTheDocument()
	})

	it('conserve le texte en cours d’édition quand la date devient invalide', async () => {
		const user = userEvent.setup()
		const Consommateur = () => {
			const [date, setDate] = useState<Date | undefined>(new Date(2026, 8, 30))

			return <DateField defaultSelected={date} onChange={setDate} />
		}
		render(
			<TestProvider>
				<Consommateur />
			</TestProvider>
		)
		const champ = screen.getByRole('textbox')
		expect(champ).toHaveValue('30/09/2026')

		await user.type(champ, '{backspace}')

		expect(champ).toHaveValue('30/09/202')
	})

	it('accepte une date admise par la validation', async () => {
		const user = userEvent.setup()
		const onChange = vi.fn()
		render(
			<TestProvider>
				<DateField
					onChange={onChange}
					validation={(date) =>
						date.getFullYear() < 2026
							? O.some('Cette date est trop ancienne')
							: O.none()
					}
				/>
			</TestProvider>
		)

		await user.type(screen.getByRole('textbox'), '15/01/2026')

		expect(onChange).toHaveBeenLastCalledWith(expect.any(Date))
		expect(
			screen.queryByText('Cette date est trop ancienne')
		).not.toBeInTheDocument()
	})
})
