import { Meta, StoryObj } from '@storybook/react'

import { Card } from './Card'

const meta: Meta<typeof Card> = {
	component: Card,
	args: {
		icon: '👋',
		ctaLabel: 'Click me',
		compact: false,
		title: 'Hello world',
		children: 'This is a card',
	},
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '300px' }}>
				{/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
				<Story />
			</div>
		),
	],
}

export default meta

type Story = StoryObj<typeof Card>

export const Link: Story = {
	args: {
		title: 'Lien externe',
		ctaLabel: 'Voir le site',
		children: 'Cette carte est un lien vers le site mon-entreprise.',
		href: 'https://mon-entreprise.urssaf.fr',
	},
}

export const Button: Story = {
	args: {
		title: 'Bouton',
		children: "Cette carte est un bouton qui ouvre une boite d'alerte.",
		onPress: () => {
			alert('Coucou !')
		},
	},
}
