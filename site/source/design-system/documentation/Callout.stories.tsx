import type { Meta, StoryObj } from '@storybook/react'

import { Callout } from './Callout'

const meta = {
	component: Callout,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: { type: 'select' },
			options: ['tip', 'note', 'important', 'caution'],
		},
		icon: {
			control: { type: 'text' },
		},
	},
} satisfies Meta<typeof Callout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		children: 'Ceci est un callout par défaut.',
	},
}

export const Conseil: Story = {
	args: {
		type: 'tip',
		icon: '💡',
		children: (
			<>
				<strong>Conseil</strong>
				<p>
					Utilisez un logiciel de gestion locative pour suivre vos recettes tout
					au long de l'année.
				</p>
			</>
		),
	},
}

export const Attention: Story = {
	args: {
		type: 'caution',
		icon: '⚠️',
		children: (
			<>
				<strong>Attention</strong>
				<p>
					Au-delà de ces plafonds, vous basculez automatiquement au régime réel
					d'imposition.
				</p>
			</>
		),
	},
}

export const Information: Story = {
	args: {
		type: 'important',
		icon: 'ℹ️',
		children: (
			<>
				<strong>Information</strong>
				<p>
					L'option pour le régime réel est valable 2 ans minimum et se reconduit
					tacitement par période de 2 ans.
				</p>
			</>
		),
	},
}

export const Note: Story = {
	args: {
		type: 'note',
		icon: '📝',
		children: (
			<>
				<strong>Note</strong>
				<p>
					Cette information est fournie à titre indicatif et peut varier selon
					votre situation.
				</p>
			</>
		),
	},
}

export const AvecListeEtTitre: Story = {
	name: 'Avec liste et titre',
	args: {
		type: 'tip',
		icon: '💡',
		children: (
			<>
				<strong>Conseil : Pour bien gérer votre location meublée</strong>
				<ul>
					<li>Conservez tous vos justificatifs</li>
					<li>Tenez un livre de recettes à jour</li>
					<li>Photographiez l'état des lieux</li>
				</ul>
			</>
		),
	},
}

export const SansIcone: Story = {
	name: 'Sans icône',
	args: {
		type: 'important',
		children: (
			<p>
				Les cotisations sociales sont calculées sur la base de vos revenus nets
				après abattement.
			</p>
		),
	},
}
