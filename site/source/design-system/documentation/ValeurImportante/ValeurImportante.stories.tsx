import type { Meta, StoryObj } from '@storybook/react'

import { ValeurImportante } from './index'

const meta = {
	component: ValeurImportante,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof ValeurImportante>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		children: '77 700 €',
	},
}

export const DansUnePhraze: Story = {
	name: 'Dans une phrase',
	render: () => (
		<p>
			Le plafond du régime micro-BIC est de{' '}
			<ValeurImportante>77 700 €</ValeurImportante> pour une location meublée
			classique.
		</p>
	),
}

export const PlusieursSeuilsDansUnTexte: Story = {
	name: 'Plusieurs seuils',
	render: () => (
		<div>
			<p>Les seuils importants à retenir :</p>
			<ul>
				<li>
					Régime général : <ValeurImportante>77 700 €</ValeurImportante>
				</li>
				<li>
					Tourisme classé : <ValeurImportante>188 700 €</ValeurImportante>
				</li>
				<li>
					Seuil de professionnalisation :{' '}
					<ValeurImportante>23 000 €</ValeurImportante>
				</li>
			</ul>
		</div>
	),
}
