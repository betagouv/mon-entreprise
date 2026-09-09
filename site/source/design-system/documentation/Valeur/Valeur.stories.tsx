import type { Meta, StoryObj } from '@storybook/react'

import { Valeur } from './index'

const meta = {
	title: 'Design System/Documentation/Valeur',
	component: Valeur,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	argTypes: {
		large: {
			control: { type: 'boolean' },
		},
		couleur: {
			control: { type: 'select' },
			options: ['primary', 'secondary', 'success', 'error'],
		},
	},
} satisfies Meta<typeof Valeur>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		children: '77 700 €',
	},
}

export const Large: Story = {
	args: {
		large: true,
		children: '188 700 €',
	},
}

export const DansUnePhraze: Story = {
	name: 'Dans une phrase',
	render: () => (
		<p>
			Le plafond du régime micro-BIC est de <Valeur>77 700 €</Valeur> par an
			pour une location meublée classique.
		</p>
	),
}

export const ResultatCalcul: Story = {
	name: 'Résultat de calcul',
	render: () => (
		<div>
			<p>Base imposable après abattement :</p>
			<p style={{ textAlign: 'center', marginTop: '1rem' }}>
				<Valeur large>15 000 €</Valeur>
			</p>
		</div>
	),
}

export const MontantSecondary: Story = {
	args: {
		couleur: 'secondary',
		children: '188 700 €',
	},
}

export const MontantSuccess: Story = {
	args: {
		couleur: 'success',
		children: '+ 12 500 €',
	},
}

export const MontantError: Story = {
	args: {
		couleur: 'error',
		children: '- 5 000 €',
	},
}

export const ComparaisonMontants: Story = {
	name: 'Comparaison de montants',
	render: () => (
		<div>
			<p>
				Le plafond du régime micro-BIC est de{' '}
				<Valeur couleur="primary">77 700 €</Valeur> pour une location meublée
				classique et de <Valeur couleur="secondary">188 700 €</Valeur> pour une
				location meublée de tourisme classée.
			</p>
			<p style={{ marginTop: '1rem' }}>
				Abattement : <Valeur>50%</Valeur> ou <Valeur>71%</Valeur>
			</p>
		</div>
	),
}
