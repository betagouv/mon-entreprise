// import { render } from '@testing-library/react'
// import { vi } from 'vitest'

// import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'

// describe('WhenNotApplicable', () => {
// 	const mockEngine = {
// 		evaluate: vi.fn(),
// 	}
// 	beforeEach(() => {
// 		vi.clearAllMocks()
// 	})

// 	it('should render children when the condition is true', () => {
// 		mockEngine.evaluate.mockReturnValueOnce({ nodeValue: true })

// 		const { getByText } = render(
// 			<WhenNotApplicable dottedName="example" engine={mockEngine as }>
// 				<div>Rendered when not applicable</div>
// 			</WhenNotApplicable>
// 		)

// 		expect(getByText('Rendered when not applicable')).
// 		expect(mockEngine.evaluate).toHaveBeenCalledWith({
// 			'est non applicable': 'example',
// 		})
// 	})

// 	it('should not render children when the condition is false', () => {
// 		mockEngine.evaluate.mockReturnValueOnce({ nodeValue: false })

// 		const { queryByText } = render(
// 			<WhenNotApplicable dottedName="example" engine={mockEngine}>
// 				<div>Rendered when not applicable</div>
// 			</WhenNotApplicable>
// 		)

// 		expect(queryByText('Rendered when not applicable')).toBeNull()
// 		expect(mockEngine.evaluate).toHaveBeenCalledWith({
// 			'est non applicable': 'example',
// 		})
// 	})

// 	it('should use the default engine when no engine is provided', () => {
// 		const { getByText } = render(
// 			<WhenNotApplicable dottedName="example">
// 				<div>Rendered when not applicable</div>
// 			</WhenNotApplicable>
// 		)

// 		expect(getByText('Rendered when not applicable')).toBeInTheDocument()
// 		expect(mockEngine.evaluate).toHaveBeenCalledWith({
// 			'est non applicable': 'example',
// 		})
// 	})
// })
