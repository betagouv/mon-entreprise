import { Meta, StoryObj } from '@storybook/react'

import { Emoji as EmojiComponent } from '.'

const meta: Meta<typeof EmojiComponent> = {
	component: EmojiComponent,
	argTypes: {
		emoji: { type: 'string' },
	},
}

export default meta

type Story = StoryObj<typeof EmojiComponent>

export const Emoji: Story = {
	args: {
		emoji: '❤️🧡💛💚💙💜',
	},
}
