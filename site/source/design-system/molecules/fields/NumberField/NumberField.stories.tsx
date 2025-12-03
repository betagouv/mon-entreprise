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
		displayedUnit: '€/mois',
		label: 'Montant mensuel brut',
	},
}

export const WithInitialValue: Story = {
	args: {
		defaultValue: 1801.8,
		displayedUnit: '€/mois',
		label: 'Montant mensuel brut (SMIC par défaut)',
	},
}

export const WithErrorMessage: Story = {
	args: {
		defaultValue: -2000,
		displayedUnit: '€/mois',
		label: 'Montant mensuel brut',
		errorMessage: 'Le montant ne peut être négatif',
	},
}
