import type { Meta, StoryObj } from '@storybook/react'

import { Li, Ul } from '../typography'
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
			Utilisez un logiciel de gestion locative pour suivre vos recettes tout au
			long de l'année.
		</Callout.Conseil>
	),
}

export const Attention: Story = {
	render: () => (
		<Callout.Attention>
			Au-delà de ces plafonds, vous basculez automatiquement au régime réel
			d'imposition.
		</Callout.Attention>
	),
}

export const Info: Story = {
	render: () => (
		<Callout.Info>
			L'option pour le régime réel est valable 2 ans minimum et se reconduit
			tacitement par période de 2 ans.
		</Callout.Info>
	),
}

export const Note: Story = {
	render: () => (
		<Callout.Note>
			Cette information est fournie à titre indicatif et peut varier selon votre
			situation.
		</Callout.Note>
	),
}

export const WithList: Story = {
	name: 'Avec liste',
	render: () => (
		<Callout.Conseil>
			<Ul>
				<Li>Conservez tous vos justificatifs</Li>
				<Li>Tenez un livre de recettes à jour</Li>
				<Li>Photographiez l'état des lieux</Li>
			</Ul>
		</Callout.Conseil>
	),
}
