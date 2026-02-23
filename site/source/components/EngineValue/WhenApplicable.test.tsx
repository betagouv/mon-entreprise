import { render, screen } from '@testing-library/react'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/utils/publicodes/EngineContext'

describe('WhenApplicable', () => {
	vi.mock('@/utils/publicodes/EngineContext', () => ({
		useEngine: vi.fn(),
	}))

	const mockEngine = {
		evaluate: vi.fn(),
	}
	const engine = mockEngine as typeof mockEngine & Engine<DottedName>

	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(useEngine).mockReturnValue(engine)
	})

	it('should render children when the condition is applicable', () => {
		mockEngine.evaluate.mockReturnValueOnce({ nodeValue: true })

		render(
			<WhenApplicable dottedName="SMIC" engine={engine}>
				<div>Rendered when applicable</div>
			</WhenApplicable>
		)

		expect(screen.getByText('Rendered when applicable')).toBeInTheDocument()

		expect(mockEngine.evaluate).toHaveBeenCalledWith({
			'est applicable': 'SMIC',
		})
	})

	it('should not render children when the condition is undefined (because of missing variables)', () => {
		mockEngine.evaluate.mockReturnValueOnce({ nodeValue: undefined })

		const { container } = render(
			<WhenApplicable dottedName="SMIC" engine={engine}>
				<div>Children</div>
			</WhenApplicable>
		)

		expect(container).toBeEmptyDOMElement()
	})
})
