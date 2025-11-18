import { Meta, StoryObj } from '@storybook/react'

import { DateFieldWithPicker } from './DateFieldWithPicker'

export default {
	title: 'Design System/molecules/fields/DateFieldWithPicker',
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
