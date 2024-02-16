import { render, screen } from '@testing-library/react'
import { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'

describe('WhenApplicable', () => {
	const mockEngine = {
		evaluate: vi.fn(),
	}
	const engine = mockEngine as typeof mockEngine & Engine<DottedName>

	beforeEach(() => {
		vi.clearAllMocks()
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
