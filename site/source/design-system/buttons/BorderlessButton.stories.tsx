import { Meta, StoryObj } from '@storybook/react'

import { LinkIcon } from '../icons'
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
				<LinkIcon />
				Générer un lien de partage
			</>
		),
	},
}
