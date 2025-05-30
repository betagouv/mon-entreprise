import { OverlayProvider } from '@react-aria/overlays'
import { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { HelpButtonWithPopover as HelpButtonWithPopoverComponent } from './HelpButtonWithPopover'

const meta: Meta<typeof HelpButtonWithPopoverComponent> = {
	component: HelpButtonWithPopoverComponent,
}

export default meta

type Story = StoryObj<typeof HelpButtonWithPopoverComponent>

export const HelpButtonWithPopover: Story = {
	render: (args) => {
		// Hack to prevent useIFrameOffset() to return undefined in Popover.tsx
		window.parent = window

		return (
			<BrowserRouter>
				<OverlayProvider>
					<HelpButtonWithPopoverComponent {...args} />
				</OverlayProvider>
			</BrowserRouter>
		)
	},
	args: {
		title: 'title',
		type: 'info',
		children: 'content',
	},
}
