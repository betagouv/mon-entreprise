import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TestProvider } from '@/test/TestProvider'

import { ListeQuestions } from './ListeQuestions'

describe('ListeQuestions', () => {
	it("ne rend rien quand aucun groupe n'est disponible", () => {
		render(
			<TestProvider>
				<ListeQuestions
					groupesDeQuestions={{}}
					onSélection={vi.fn()}
					retour={vi.fn()}
				/>
			</TestProvider>
		)

		expect(screen.queryAllByRole('button')).toHaveLength(0)
		expect(screen.queryByRole('list')).not.toBeInTheDocument()
	})
})
