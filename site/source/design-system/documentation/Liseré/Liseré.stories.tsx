import type { Meta, StoryObj } from '@storybook/react'

import { Liseré } from './index'

const meta = {
	component: Liseré,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	argTypes: {
		couleur: {
			control: { type: 'color' },
		},
		label: {
			control: { type: 'text' },
		},
	},
} satisfies Meta<typeof Liseré>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		children: (
			<p>
				Ce bloc met en évidence une information importante avec une bordure
				colorée.
			</p>
		),
	},
}

export const AvecLabel: Story = {
	args: {
		label: 'Important',
		couleur: '#e53e3e',
		children: (
			<p>
				Les cotisations sociales sont calculées sur la base de vos revenus nets
				après abattement.
			</p>
		),
	},
}

export const Exemple: Story = {
	args: {
		label: 'Exemple',
		couleur: '#3182ce',
		children: (
			<div>
				<p>Pour des recettes de 30 000 € :</p>
				<ul>
					<li>Abattement micro-BIC (50%) : 15 000 €</li>
					<li>Base imposable : 15 000 €</li>
					<li>Cotisations sociales (17,2%) : 2 580 €</li>
				</ul>
			</div>
		),
	},
}

export const Astuce: Story = {
	args: {
		label: 'Astuce',
		couleur: '#38a169',
		children: (
			<p>
				Conservez tous vos justificatifs même en régime micro-BIC, ils pourront
				vous être utiles si vous passez au régime réel.
			</p>
		),
	},
}
