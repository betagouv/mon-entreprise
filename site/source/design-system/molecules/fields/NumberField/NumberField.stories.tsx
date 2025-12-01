import { Meta, StoryObj } from '@storybook/react'

import { NumberField } from './NumberField'

export default {
	title: 'Design System/molecules/fields/NumberField',
	component: NumberField,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof NumberField>

type Story = StoryObj<typeof NumberField>

export const Default: Story = {
	args: {
		label: 'Label du champ',
	},
}

export const WithDisplayedUnit: Story = {
	args: {
		label: 'Montant annuel',
		displayedUnit: '€/mois',
	},
}
