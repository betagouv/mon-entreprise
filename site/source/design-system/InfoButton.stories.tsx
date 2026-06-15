import { Decorator, Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import { InfoButton } from './InfoButton'

const RouterDecorator: Decorator = (Story) => (
	<MemoryRouter>
		<Story />
	</MemoryRouter>
)

const meta = {
	component: InfoButton,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	decorators: [RouterDecorator],
} satisfies Meta<typeof InfoButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		title: "Titre de l'info-bulle",
		description: "Description détaillée dans l'info-bulle.",
	},
}

export const WithMarkdown: Story = {
	args: {
		title: 'Avec markdown',
		description: `
# Titre dans l'info-bulle
- Point 1
- Point 2
- **Texte en gras**
- *Texte en italique*
    `,
	},
}

export const WithChildren: Story = {
	args: {
		title: 'Avec contenu personnalisé',
		children: (
			<div
				style={{
					padding: '1rem',
					backgroundColor: '#f5f5f5',
					borderRadius: '8px',
				}}
			>
				<h3>Contenu personnalisé</h3>
				<p>C'est un exemple de contenu React personnalisé dans l'info-bulle.</p>
				<button>Un bouton dans l'info-bulle</button>
			</div>
		),
	},
}
