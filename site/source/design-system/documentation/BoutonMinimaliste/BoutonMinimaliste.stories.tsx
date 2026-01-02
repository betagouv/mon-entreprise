import type { Meta, StoryObj } from '@storybook/react'

import { BoutonMinimaliste } from './index'

const meta = {
	component: BoutonMinimaliste,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof BoutonMinimaliste>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		children: 'En savoir plus',
	},
}

export const AvecEmoji: Story = {
	args: {
		children: '📖 Documentation',
	},
}

export const PlusieursActions: Story = {
	name: 'Plusieurs actions',
	render: () => (
		<div style={{ display: 'flex', gap: '0.5rem' }}>
			<BoutonMinimaliste>Calculer</BoutonMinimaliste>
			<BoutonMinimaliste>Réinitialiser</BoutonMinimaliste>
			<BoutonMinimaliste>Aide</BoutonMinimaliste>
		</div>
	),
}

export const DansUnTexte: Story = {
	name: 'Dans un texte',
	render: () => (
		<p>
			Pour plus d'informations sur ce sujet,{' '}
			<BoutonMinimaliste>cliquez ici</BoutonMinimaliste> ou consultez notre
			guide complet.
		</p>
	),
}
