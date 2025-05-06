import { Meta, StoryObj } from '@storybook/react'

import { Button } from '@/design-system/buttons'

const meta: Meta<typeof Button> = {
	component: Button,
	argTypes: {
		children: { type: 'string' },
	},
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
	args: {
		size: 'XL',
		color: 'primary',
		children: 'Primary XL button',
	},
}

export const Secondary: Story = {
	args: {
		size: 'XS',
		color: 'secondary',
		children: 'Secondary XS button',
	},
}
