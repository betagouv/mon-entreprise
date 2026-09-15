import type { Meta, StoryObj } from '@storybook/react'

import { Body, H4 } from '../typography'
import { BasicCard } from './BasicCard'

const meta: Meta<typeof BasicCard> = {
	component: BasicCard,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof BasicCard>

export const Default: Story = {
	args: {
		children: (
			<>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
					}}
				>
					<div>
						<H4 style={{ margin: 0 }}>Ceci est un carte cliquable.</H4>
						<Body style={{ marginBottom: 0 }}>
							Avec un titre et un paragraphe.
						</Body>
					</div>
					<div>
						<Body
							style={{ margin: 0, padding: '1rem', backgroundColor: '#FFF4D2' }}
						>
							Et d'autres éléments...
						</Body>
					</div>
				</div>
			</>
		),
		onPress: () => alert('Carte cliquée'),
		'aria-label': 'aria-label du bouton',
	},
}
