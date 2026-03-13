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
		label: 'Montant annuel brut',
		unit: '€/an',
	},
}

export const WithCents: Story = {
	args: {
		label: 'Montant mensuel net',
		unit: '€/mois',
		withCents: true,
	},
}

export const WithPlaceholder: Story = {
	args: {
		label: 'Montant mensuel brut',
		placeholder: '1801.8',
		unit: '€/mois',
		withCents: true,
	},
}

export const WithInitialValue: Story = {
	args: {
		defaultValue: 1801.8,
		label: 'Montant mensuel brut (SMIC par défaut)',
		unit: '€/mois',
		withCents: true,
	},
}
