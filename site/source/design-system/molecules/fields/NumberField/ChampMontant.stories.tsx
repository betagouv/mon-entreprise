import { Meta, StoryObj } from '@storybook/react'

import { montant } from '@/domaine/Montant'

import { ChampMontant } from './ChampMontant'

export default {
	component: ChampMontant,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof ChampMontant>

type Story = StoryObj<typeof ChampMontant>

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
		placeholder: 'par exemple : 2000',
		unit: '€/mois',
		withCents: true,
	},
}

export const WithInitialValue: Story = {
	args: {
		defaultMontant: montant(1801.8, '€/mois'),
		label: 'Montant mensuel brut (SMIC par défaut)',
		unit: '€/mois',
		withCents: true,
	},
}

export const WithDescription: Story = {
	args: {
		description:
			'Brut de référence (sans les primes, indemnités ni majorations)',
		displayedUnit: '€/mois',
		label: 'Salaire mensuel brut',
	},
}

export const WithSuggestions = {
	args: {
		description:
			'Brut de référence (sans les primes, indemnités ni majorations)',
		label: 'Salaire mensuel brut',
		suggestionsDeMontants: {
			'salaire médian': montant(2700, '€/mois'),
			SMIC: montant(1801.8, '€/mois'),
		},
		unit: '€/mois',
		withCents: true,
	},
}
