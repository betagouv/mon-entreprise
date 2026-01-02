import { Meta, StoryObj } from '@storybook/react'

import { DateFieldWithPicker } from './DateFieldWithPicker'

export default {
	component: DateFieldWithPicker,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof DateFieldWithPicker>

type Story = StoryObj<typeof DateFieldWithPicker>

export const Default: Story = {
	args: {
		label: 'Date de création',
	},
}

export const WithInitialValue: Story = {
	args: {
		defaultSelected: new Date('2000-01-31'),
		label: 'Avec valeur initiale',
	},
}
