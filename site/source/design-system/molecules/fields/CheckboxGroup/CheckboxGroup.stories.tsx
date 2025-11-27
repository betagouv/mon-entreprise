import { Meta, StoryObj } from '@storybook/react'

import { CheckboxGroup } from './CheckboxGroup'

const CHECKBOX_OPTIONS = [
	{
		value: 'option1',
		label: 'Option 1',
	},
	{
		value: 'option2',
		label: 'Option 2',
	},
	{
		value: 'option3',
		label: 'Option 3',
	},
]

export default {
	title: 'Design System/molecules/fields/CheckboxGroup',
	component: CheckboxGroup,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof CheckboxGroup>

type Story = StoryObj<typeof CheckboxGroup>

export const Default: Story = {
	args: {
		legend: 'Légende du groupe de checkbox',
		options: CHECKBOX_OPTIONS,
	},
}
