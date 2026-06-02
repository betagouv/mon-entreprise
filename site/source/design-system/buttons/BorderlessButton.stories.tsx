import { Meta, StoryObj } from '@storybook/react'

import { PaperClip } from '../icons'
import { BorderlessButton } from './BorderlessButton'

const meta: Meta<typeof BorderlessButton> = {
	component: BorderlessButton,
	argTypes: {
		children: { type: 'string' },
	},
}

export default meta

type Story = StoryObj<typeof BorderlessButton>

export const Partage: Story = {
	args: {
		children: (
			<>
				<PaperClip />
				Générer un lien de partage
			</>
		),
	},
}
