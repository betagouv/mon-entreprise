import { render, screen } from '@testing-library/react'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'
import { DottedName } from '@/domaine/publicodes/DottedName'

describe('WhenNotApplicable', () => {
	const mockEngine = {
		evaluate: vi.fn(),
	}
	const engine = mockEngine as typeof mockEngine & Engine<DottedName>

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should render children when the condition not applicable', () => {
		mockEngine.evaluate.mockReturnValueOnce({ nodeValue: true })

		render(
			<WhenNotApplicable dottedName="SMIC" engine={engine}>
				<div>Rendered when not applicable</div>
			</WhenNotApplicable>
		)

		expect(screen.getByText('Rendered when not applicable')).toBeInTheDocument()

		expect(mockEngine.evaluate).toHaveBeenCalledWith({
			'est non applicable': 'SMIC',
		})
	})

	it('should not render children when the condition is undefined (because of missing variables)', () => {
		mockEngine.evaluate.mockReturnValueOnce({ nodeValue: undefined })

		const { container } = render(
			<WhenNotApplicable dottedName="SMIC" engine={engine}>
				<div>Children</div>
			</WhenNotApplicable>
		)

		expect(container).toBeEmptyDOMElement()
	})
})
