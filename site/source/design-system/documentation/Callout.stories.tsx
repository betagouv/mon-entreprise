import type { Meta, StoryObj } from '@storybook/react'

import * as Callout from './Callout'

const meta = {
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Conseil: Story = {
	render: () => (
		<Callout.Conseil>
			<p>
				Utilisez un logiciel de gestion locative pour suivre vos recettes tout
				au long de l'année.
			</p>
		</Callout.Conseil>
	),
}

export const Attention: Story = {
	render: () => (
		<Callout.Attention>
			<p>
				Au-delà de ces plafonds, vous basculez automatiquement au régime réel
				d'imposition.
			</p>
		</Callout.Attention>
	),
}

export const Info: Story = {
	render: () => (
		<Callout.Info>
			<p>
				L'option pour le régime réel est valable 2 ans minimum et se reconduit
				tacitement par période de 2 ans.
			</p>
		</Callout.Info>
	),
}

export const Note: Story = {
	render: () => (
		<Callout.Note>
			<p>
				Cette information est fournie à titre indicatif et peut varier selon
				votre situation.
			</p>
		</Callout.Note>
	),
}

export const WithList: Story = {
	name: 'Avec liste',
	render: () => (
		<Callout.Conseil>
			<ul>
				<li>Conservez tous vos justificatifs</li>
				<li>Tenez un livre de recettes à jour</li>
				<li>Photographiez l'état des lieux</li>
			</ul>
		</Callout.Conseil>
	),
}
