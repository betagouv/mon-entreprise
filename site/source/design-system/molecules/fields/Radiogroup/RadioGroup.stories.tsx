import { Meta, StoryObj } from '@storybook/react'

import { RadioGroup } from './RadioGroup'

export default {
	title: 'Design System/molecules/fields/RadioGroup',
	component: RadioGroup,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof RadioGroup>

type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
	args: {
		legend: 'Légende du radiogroup',
		options: ['Option 1', 'Option 2', 'Option 3'],
	},
}
