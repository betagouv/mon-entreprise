import { Meta, StoryFn, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import { InfoButton } from './InfoButton'

const RouterDecorator = (Story: StoryFn) => (
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

export const WithLightStyle: Story = {
	args: {
		title: 'Style léger',
		description:
			"Info-bulle avec style léger (pour les contextes où l'importance est moindre)",
		light: true,
	},
}

export const WithBigPopover: Story = {
	args: {
		title: 'Grande info-bulle',
		description:
			"Une info-bulle plus grande pour afficher plus de contenu.\n\nCette info-bulle a une taille plus grande que la normale, permettant d'afficher davantage de contenu sans que l'utilisateur ait à faire défiler autant.",
		bigPopover: true,
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
