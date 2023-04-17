import { Meta, StoryObj } from '@storybook/react'

import { Switch } from '@/design-system/switch'

const meta: Meta<typeof Switch> = {
	component: Switch,
	argTypes: {
		children: {
			type: 'string',
		},
	},
}

export default meta

type Story = StoryObj<typeof Switch>

export const Basic: Story = {
	args: {
		children: 'Label',
	},
}

export const Selected: Story = {
	args: {
		isSelected: true,
	},
}

export const Disabled: Story = {
	args: {
		isDisabled: true,
	},
}
