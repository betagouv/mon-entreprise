import type { Meta, StoryObj } from '@storybook/react'

import { Body, H4 } from '../typography'
import { BasicClickableCard } from './BasicClickableCard'

const meta: Meta<typeof BasicClickableCard> = {
	component: BasicClickableCard,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof BasicClickableCard>

export const Default: Story = {
	args: {
		children: (
			<>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
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
		onClick: () => alert('Carte cliquée'),
		ariaLabel: 'aria-label de la carte',
	},
}
