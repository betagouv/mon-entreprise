import { Meta, StoryObj } from '@storybook/react'

import { AmountField } from './AmountField'

export default {
	component: AmountField,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof AmountField>

type Story = StoryObj<typeof AmountField>

export const Default: Story = {
	args: {
		label: 'Montant',
	},
}
