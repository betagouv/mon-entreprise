import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import rules from 'modele-ti'
import { describe, expect, it } from 'vitest'

import { TestProvider } from '@/test/TestProvider'
import { EngineProvider } from '@/utils/publicodes/EngineContext'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import { DateCessationQuestion } from './DateCessationQuestion'

const rendreLaQuestion = () => {
	const engine = engineFactory(rules, 'modele-ti')
	engine.setSituation({ "entreprise . en cessation d'activité": 'oui' })

	return render(
		<TestProvider>
			<EngineProvider value={engine}>
				<DateCessationQuestion />
			</EngineProvider>
		</TestProvider>
	)
}

describe('DateCessationQuestion', () => {
	it('refuse une date de cessation antérieure à 2023 et affiche la raison', async () => {
		const user = userEvent.setup()
		rendreLaQuestion()

		const champ = screen.getByRole('textbox')
		await user.clear(champ)
		await user.type(champ, '31/12/2022')

		expect(
			await screen.findByText(
				/ne gère pas les cessations d.activité avant 2023/i
			)
		).toBeInTheDocument()
	})

	it('accepte une date de cessation à partir de 2023', async () => {
		const user = userEvent.setup()
		rendreLaQuestion()

		const champ = screen.getByRole('textbox')
		await user.clear(champ)
		await user.type(champ, '15/06/2024')

		expect(
			screen.queryByText(/ne gère pas les cessations d.activité avant 2023/i)
		).not.toBeInTheDocument()
	})
})
